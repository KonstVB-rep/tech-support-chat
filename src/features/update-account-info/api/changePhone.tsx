"use server";

import { getProfile } from "@/entities/profile/api";
import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { ActionStateWithData } from "@/shared/lib/types";
import { Profile } from "@prisma/client";

export const changePhone = async (
  newPhone: string,
  profileId: string,
): Promise<ActionStateWithData<Profile>> => {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { success: false, data: null, error: "Не авторизован" };
    }

    const profileWIthOrganization = await getProfile(session.user.id);

    if (!profileWIthOrganization) {
      return { success: false, data: null, error: "Профиль не найден" };
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profileId },
      data: { phone: newPhone },
    });

    return { success: true, data: updatedProfile, error: null };
  } catch (error) {
    console.log(error);
    return { success: false, data: null, error: "Произошла ошибка сервера" };
  }
};
