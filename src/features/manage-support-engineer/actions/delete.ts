// src/features/manage-support-engineer/actions/delete.ts
"use server";

import { prisma } from "@/prisma/prisma-client";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { updateTag } from "next/cache";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";
import { unlink } from "fs/promises";
import path from "path";
import { getSession } from "@/shared/lib/server-current-user";
import { USER_ROLE } from "@/shared/constants";
import { DeleteActionState } from "@/shared/lib/types";

export const deleteSupportEngineerAction = async (
  ids: string | string[],
): Promise<DeleteActionState> => {
  try {
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

    const idsArray = Array.isArray(ids) ? ids : [ids];
    const validIds = idsArray.filter((id) => id && id.trim() !== "");

    if (!validIds.length) {
      return {
        success: false,
        deletedCount: 0,
        error: "Не переданы валидные ID для удаления",
      };
    }

    const engineersData = await prisma.supportEngineer.findMany({
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

    if (!engineersData.length) {
      return {
        success: false,
        deletedCount: 0,
        error: "Специалисты техподдержки не найдены",
      };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const suffix = `_deleted_${timestamp}`;

    const updateOperations = engineersData
      .map((engineer) => {
        const profile = engineer.profile;
        if (!profile) return [];

        const newFakeEmail = `${profile.email}${suffix}`;
        const originalName = profile.name || "Без имени";

        return [
          prisma.user.update({
            where: { id: profile.userId },
            data: {
              isActive: false,
              banned: true,
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
          prisma.supportEngineer.delete({
            where: { id: engineer.id },
          }),
        ];
      })
      .flat();

    if (updateOperations.length > 0) {
      await prisma.$transaction(updateOperations);
    }

    const requestHeaders = await headers();
    for (const engineer of engineersData) {
      const profile = engineer.profile;
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

    updateTag("support-engineers");
    for (const id of validIds) {
      updateTag(`support-engineer-${id}`);
    }

    for (const engineer of engineersData) {
      const profile = engineer.profile;
      if (!profile) continue;

      await triggerSocketEvent("srv:user:updated", {
        userId: profile.userId,
        profileId: profile.id,
        organizationId: null,
        name: profile.name || "Без имени",
        deactivationLabel: "Уволен",
        image: null,
        isEngineer: false,
      });
    }

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
