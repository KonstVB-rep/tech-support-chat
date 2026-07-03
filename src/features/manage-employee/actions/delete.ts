// src/features/manage-employee/actions/delete.ts
"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/prisma/prisma-client";
import { hasEmployeeManagePermission } from "../lib/checkPermission";

import { DeleteActionState, UserRoleTypes } from "@/shared/lib/types";
import { getSession } from "@/shared/lib/server-current-user";

export const deleteEmployeeAction = async (
  ids: string | string[],
  organizationId: string,
): Promise<DeleteActionState> => {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { success: false, deletedCount: 0, error: "Не авторизован" };
    }

    const idsArray = Array.isArray(ids) ? ids : [ids];
    const validIds = idsArray.filter((id) => id && id.trim() !== "");

    if (!validIds.length) {
      return {
        success: false,
        deletedCount: 0,
        error: "Не переданы валидные ID для удаления",
      };
    }

    // 1. Проверка прав (одиночная или массовая)
    if (validIds.length === 1) {
      const check = await hasEmployeeManagePermission({
        user: { id: session.user.id, role: session.user.role as UserRoleTypes },
        organizationId,
        targetEmployeeId: validIds[0],
        isDeleteAction: true,
      });
      if (!check.allowed)
        return { success: false, deletedCount: 0, error: check.error };
    } else {
      for (const targetId of validIds) {
        const check = await hasEmployeeManagePermission({
          user: { id: session.user.id, role: session.user.role as UserRoleTypes },
          organizationId,
          targetEmployeeId: targetId,
          isDeleteAction: true,
        });
        if (!check.allowed)
          return { success: false, deletedCount: 0, error: check.error };
      }
    }

    // 2. ВЫТЯГИВАЕМ ТЕКУЩИЕ ДАННЫЕ ЮЗЕРОВ И ПРОФИЛЕЙ
    const membersData = await prisma.organizationMember.findMany({
      where: { id: { in: validIds } },
      select: {
        id: true, // ID связи organization_member
        profile: {
          select: {
            id: true, // ID профиля
            email: true, // Текущий email профиля
            userId: true, // ID юзера
            username: true, // Имя юзера
          },
        },
      },
    });

    if (!membersData.length) {
      return {
        success: false,
        deletedCount: 0,
        error: "Сотрудники не найдены",
      };
    }

    // Генерируем уникальный временной маркер увольнения (Unix timestamp)
    const timestamp = Math.floor(Date.now() / 1000);

    // 3. 🚀 АТОМАРНАЯ ТРАНЗАКЦИЯ ОБЕЗЛИЧИВАНИЯ:
    // Мы пакуем все апдейты в единый безопасный пакет транзакции Prisma
    const updateOperations = membersData
      .map((member) => {
        const profile = member.profile;
        if (!profile) return [];

        const suffix = `_banned_${timestamp}`;
        const newFakeEmail = `${profile.email}${suffix}`;

        return [
          // Изменяем системного User в Better Auth: гасим флаг, сбрасываем уникальный email
          prisma.user.update({
            where: { id: profile.userId },
            data: {
              isActive: false,
              email: newFakeEmail, // 🎯 Почта свободна для новых людей!
            },
          }),
          // Изменяем Profile мессенджера: сбрасываем уникальный email и телефон, НО ИМЯ ОСТАВЛЯЕМ ДЛЯ ЧАТОВ!
          prisma.profile.update({
            where: { id: profile.id },
            data: {
              email: newFakeEmail,
              phone: null,
              username: profile.username
                ? `${profile.username}${suffix}`
                : null, // Убираем уникальность юзернейма
            },
          }),
          // Полностью удаляем запись-мост из текущей организации, чтобы очистить списки компании
          prisma.organizationMember.delete({
            where: { id: member.id },
          }),
        ];
      })
      .flat();

    if (updateOperations.length > 0) {
      await prisma.$transaction(updateOperations);
    }

    // 4. Ревалидация серверного кэша
    validIds.forEach((id) => {
      updateTag(`employee-${id}`);
    });
    updateTag(`employees-${organizationId}`);

    return {
      success: true,
      deletedCount: membersData.length,
      error: null,
    };
  } catch (error) {
    console.error("Критическая ошибка в deleteEmployeeAction:", error);
    return {
      success: false,
      deletedCount: 0,
      error: "Системная ошибка при деактивации и обезличивании сотрудника",
    };
  }
};
