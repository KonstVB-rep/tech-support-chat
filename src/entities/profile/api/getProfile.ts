"use server";

import { prisma } from "@/prisma/prisma-client";

export const getProfile = async (id: string) => {
  if (!id) return null;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: id },
      include: {
        user: { select: { email: true, role: true } },
        organizationMember: { include: { organization: true } },
      },
    });

    console.log(profile, "getProfile");

    return profile;
  } catch (error) {
    // Логирование
    console.error("Failed to fetch profile:", error);

    // Кастомная ошибка для UI
    throw new Error("Не удалось загрузить профиль");
  }
};
