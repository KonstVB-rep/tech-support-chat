"use server";

import { prisma } from "@/prisma/prisma-client";
import { cacheTag } from "next/cache";

export const getProfile = async (id: string) => {
  "use cache";
  cacheTag(`profile-${id}`);

  if (!id) {
    return null;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!profile) {
      return null;
    }

    const targetOrgId = "a07b9356-714d-11f1-8ff3-ac1f6bbb108e";

    const currentMembership = profile.organizationMembers.find(
      (member) => member.organizationId === targetOrgId,
    );

    // Получаем роль ("RESPONSIBLE" или "MEMBER")
    // const orgRole = currentMembership ? currentMembership.role : null;
    // const position = currentMembership
    //   ? currentMembership.position
    //   : "Не указана";

    return profile;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw new Error("Не удалось загрузить профиль");
  }
};
