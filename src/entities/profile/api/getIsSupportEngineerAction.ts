"use server";

import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";

export const getIsSupportEngineerAction = async (): Promise<boolean> => {
  "use cache";
  cacheTag("support-engineer-role");
  cacheLife("hours"); // ✅ Кэшируем — роль не меняется, это безопасно

  try {
    const session = await getSession();
    if (!session?.user) return false;

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) return false;

    const supportRecord = await prisma.supportEngineer.findUnique({
      where: { profileId: profile.id },
    });

    return !!supportRecord;
  } catch (error) {
    console.error("Ошибка проверки роли инженера:", error);
    return false;
  }
};
