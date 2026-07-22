// src/entities/employee/actions/checkIsSupportAction.ts
"use server";

import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";

export const checkIsSupportAction = async (): Promise<boolean> => {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!userProfile) return false;

    const isSupportEngineer = await prisma.supportEngineer.findUnique({
      where: { profileId: userProfile.id },
      select: { id: true },
    });

    return !!isSupportEngineer;
  } catch (error) {
    console.error(
      "❌ [checkIsSupportAction] Ошибка проверки роли инженера:",
      error,
    );
    return false; // При любом сбое БД закрываем доступ ради безопасности контура
  }
};

export const checkIsSupportActionNyProfileId = async (
  profileId: string,
): Promise<boolean> => {
  try {
    const session = await getSession();
    if (!session?.user) return false;

    const isSupportEngineer = await prisma.supportEngineer.findUnique({
      where: { profileId },
      select: { id: true },
    });

    return !!isSupportEngineer;
  } catch (error) {
    console.error(
      "❌ [checkIsSupportAction] Ошибка проверки роли инженера:",
      error,
    );
    return false; // При любом сбое БД закрываем доступ ради безопасности контура
  }
};
