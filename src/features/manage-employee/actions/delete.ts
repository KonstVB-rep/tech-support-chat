"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/prisma/prisma-client";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";
import { unlink } from "fs/promises";
import path from "path";
import {
  EMPLOYEE_MANAGE_ACTIONS,
  hasEmployeeManagePermission,
} from "../lib/checkPermission";
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

    // 1. Проверка прав
    for (const targetId of validIds) {
      const check = await hasEmployeeManagePermission({
        user: { id: session.user.id, role: session.user.role as UserRoleTypes },
        organizationId,
        targetEmployeeId: targetId,
        actionType: EMPLOYEE_MANAGE_ACTIONS.DELETE,
      });
      if (!check.allowed) {
        return { success: false, deletedCount: 0, error: check.error };
      }
    }

    // 2. Получаем данные сотрудников
    const membersData = await prisma.organizationMember.findMany({
      where: { id: { in: validIds } },
      select: {
        id: true,
        profile: {
          select: {
            id: true,
            email: true,
            userId: true,
            username: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!membersData.length) {
      return { success: false, deletedCount: 0, error: "Сотрудники не найдены" };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const suffix = `_deleted_${timestamp}`;

    // 3. Атомарная транзакция обезличивания
    const updateOperations = membersData
      .map((member) => {
        const profile = member.profile;
        if (!profile) return [];

        const newFakeEmail = `${profile.email}${suffix}`;
        const originalName = profile.name || "Без имени";

        return [
          prisma.user.update({
            where: { id: profile.userId },
            data: {
              isActive: false,
              email: newFakeEmail,
              name: originalName,
              image: null,
            },
          }),
          prisma.profile.update({
            where: { id: profile.id },
            data: {
              name: originalName,
              deactivationLabel: "Уволен",
              email: newFakeEmail,
              phone: null,
              username: profile.username
                ? `${profile.username}${suffix}`
                : null,
              imageUrl: null,
              deletedAt: new Date(),
            },
          }),
          prisma.organizationMember.delete({
            where: { id: member.id },
          }),
        ];
      })
      .flat();

    if (updateOperations.length > 0) {
      await prisma.$transaction(updateOperations);
    }

    // 4. Удаляем аватары с диска + блокировка входа
    const requestHeaders = await headers();
    for (const member of membersData) {
      const profile = member.profile;
      if (!profile) continue;

      if (
        profile.imageUrl &&
        typeof profile.imageUrl === "string" &&
        profile.imageUrl.startsWith("/uploads/")
      ) {
        const filePath = path.join(process.cwd(), "public", profile.imageUrl);
        try {
          await unlink(filePath);
        } catch {}
      }

      try {
        await auth.api.banUser({
          body: { userId: profile.userId },
          headers: requestHeaders,
        });
      } catch (e) {
        console.error(
          `⚠️ Не удалось заблокировать аккаунт ${profile.userId}:`,
          e,
        );
      }
    }

    // 5. Инвалидация серверного кэша
    for (const id of validIds) {
      updateTag(`employee-${id}`);
    }
    updateTag(`employees-${organizationId}`);
    updateTag("support-engineers");

    // 6. Real-time уведомление
    for (const member of membersData) {
      const profile = member.profile;
      if (!profile) continue;

      await triggerSocketEvent("srv:user:updated", {
        userId: profile.userId,
        profileId: profile.id,
        organizationId,
        name: profile.name || "Без имени",
        deactivationLabel: "Уволен",
        image: null,
        isEngineer: false,
      });
    }

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