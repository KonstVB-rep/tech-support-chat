// src/features/manage-support-engineer/actions/delete.ts
"use server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { DeleteActionState } from "@/shared/lib/types";

import { updateTag } from "next/cache";
import { headers } from "next/headers";

export const deleteSupportEngineerAction = async (
  id: string,
): Promise<DeleteActionState> => {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role !== "ADMIN") {
      return {
        success: false,
        error: "Доступ запрещен. Требуются права администратора.",
      };
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    await auth.api.revokeUserSessions({
      body: {
        userId: id,
      },
      headers: await headers(),
    });

    updateTag("support-engineers");

    return { success: true, error: null };
  } catch (error) {
    console.error("Ошибка при выполнении deleteSupportEngineerAction:", error);
    return {
      success: false,
      error: "Системная ошибка базы данных при удалении сотрудника",
    };
  }
};
