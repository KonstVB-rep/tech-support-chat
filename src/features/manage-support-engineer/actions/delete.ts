// src/features/manage-support-engineer/actions/delete.ts
"use server";

import { prisma } from "@/prisma/prisma-client";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { updateTag } from "next/cache";
import { getSession } from "@/shared/lib/server-current-user";
import { USER_ROLE } from "@/shared/constants";
import { DeleteActionState } from "@/shared/lib/types";

export const deleteSupportEngineerAction = async (
  ids: string | string[],
): Promise<DeleteActionState> => {
  try {
    // 1. Проверяем сессию и права суперадмина портала Beget
    const session = await getSession();
    if (
      !session?.user ||
      session.user.role.toLowerCase() !== USER_ROLE.ADMIN.toLowerCase()
    ) {
      return {
        success: false,
        deletedCount: 0,
        error: "Доступ запрещен. Требуются права администратора системы.",
      };
    }

    // Нормализуем входящие ID к массиву строк
    const idsArray = Array.isArray(ids) ? ids : [ids];
    const validIds = idsArray.filter((id) => id && id.trim() !== "");

    if (!validIds.length) {
      return {
        success: false,
        deletedCount: 0,
        error: "Не переданы валидные ID для удаления",
      };
    }

    // 2. ВЫТЯГИВАЕМ ТЕКУЩИЕ ДАННЫЕ ИНЖЕНЕРОВ И ИХ ПРОФИЛЕЙ
    // Помним, что validIds — это идентификаторы из таблицы SupportEngineer!
    const engineersData = await prisma.supportEngineer.findMany({
      where: { id: { in: validIds } },
      select: {
        id: true, // ID записи в таблице support_engineer
        profile: {
          select: {
            id: true, // ID профиля
            email: true, // Текущий email профиля
            userId: true, // ID юзера в Better Auth
            username: true, // Имя юзера
          },
        },
      },
    });

    if (!engineersData.length) {
      return {
        success: false,
        deletedCount: 0,
        error: "Специалисты техподдержки не найдены",
      };
    }

    // Генерируем уникальный временной маркер увольнения (Unix timestamp)
    const timestamp = Math.floor(Date.now() / 1000);

    // 3. 🚀 АТОМАРНАЯ ТРАНЗАКЦИЯ ОБЕЗЛИЧИВАНИЯ И СОФТ-БЛОКА:
    // Пакуем все операции в единый безопасный пакет транзакции Prisma
    const updateOperations = engineersData
      .map((engineer) => {
        const profile = engineer.profile;
        if (!profile) return [];

        const suffix = `_banned_${timestamp}`;
        const newFakeEmail = `${profile.email}${suffix}`;

        return [
          // А) Изменяем системного User в Better Auth: гасим флаг активности,
          // ставим нативный бан и сбрасываем уникальный email, чтобы освободить его!
          prisma.user.update({
            where: { id: profile.userId },
            data: {
              isActive: false,
              banned: true, // Бест-практикс: Нативный бан для Better Auth
              email: newFakeEmail, // Почта свободна для новых людей!
            },
          }),

          // Б) Изменяем Profile мессенджера: сбрасываем уникальный email и телефон,
          // НО ФИО ОСТАВЛЯЕМ, ЧТОБЫ СТАРЫЕ ПЕРЕПИСКИ И ТИКЕТЫ НЕ СЛЕТЕЛИ В ЧАТАХ!
          prisma.profile.update({
            where: { id: profile.id },
            data: {
              email: newFakeEmail,
              phone: null,
              username: profile.username
                ? `${profile.username}${suffix}`
                : null, // Убираем уникальность юзернейма специалиста
            },
          }),

          // В) Полностью удаляем запись-удостоверение из таблицы-моста support_engineer,
          // чтобы специалист мгновенно исчез из списков активного персонала техподдержки
          prisma.supportEngineer.delete({
            where: { id: engineer.id },
          }),
        ];
      })
      .flat();

    if (updateOperations.length > 0) {
      await prisma.$transaction(updateOperations);
    }

    // 4. 🔒 БЕЗОПАСНОСТЬ: Намертво сбрасываем активные сессии (разлогиниваем) уволенных людей
    const requestHeaders = await headers();
    const userIdsToRevoke = engineersData
      .map((eng) => eng.profile?.userId)
      .filter((id): id is string => !!id);

    await Promise.all(
      userIdsToRevoke.map((userId) =>
        auth.api
          .revokeUserSessions({
            body: { userId },
            headers: requestHeaders,
          })
          .catch((err) =>
            console.error(`Не удалось отозвать сессию для ${userId}:`, err),
          ),
      ),
    );

    // 5. РЕВАЛИДАЦИЯ СЕРВЕРНОГО КЭША NEXT.JS 16.2
    updateTag("support-engineers");
    validIds.forEach((id) => {
      updateTag(`support-engineer-${id}`);
    });

    return {
      success: true,
      deletedCount: engineersData.length,
      error: null,
    };
  } catch (error) {
    console.error("Критическая ошибка в deleteSupportEngineerAction:", error);
    return {
      success: false,
      deletedCount: 0,
      error:
        "Системная ошибка при деактивации и обезличивании специалистов техподдержки",
    };
  }
};
