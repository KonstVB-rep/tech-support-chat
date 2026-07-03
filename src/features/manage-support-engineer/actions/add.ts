// src/features/manage-support-engineer/actions/add.ts
"use server";
import { prisma } from "@/prisma/prisma-client";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { updateTag } from "next/cache";
import { getSession } from "@/shared/lib/server-current-user";
import { supportEngineerFormSchema } from "@/entities/support-engineer";
import { ActionState } from "@/shared/lib/types";
import { generateRandomString } from "better-auth/crypto";

export const addSupportEngineerAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const session = await getSession();
    if (!session?.user)
      return { success: false, message: null, error: "Не авторизован" };
    if (session.user.role !== "admin")
      return { success: false, message: null, error: "Доступ запрещен" };

    const rawData = Object.fromEntries(formData.entries());
    const validated = supportEngineerFormSchema.safeParse(rawData);

    if (!validated.success)
      return {
        success: false,
        message: null,
        error: "Ошибка валидации данных",
      };

    const { email, name } = validated.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return {
        success: false,
        message: null,
        error: "Пользователь уже существует",
      };

    // Создаём User через Better Auth
    const result = await auth.api.createUser({
      body: {
        email,
        name,
        role: "user",
        password: generateRandomString(32),
      },
    });

    if (!result?.user?.id) {
      return {
        success: false,
        message: null,
        error: "Не удалось создать аккаунт",
      };
    }

    // Создаем профиль
    const createdProfile = await prisma.profile.create({
      data: {
        userId: result.user.id,
        name,
        email,
      },
    });

    // 🎯 Выдаем удостоверение инженера техподдержки: просто делаем запись в таблицу!
    await prisma.supportEngineer.create({
      data: {
        profileId: createdProfile.id,
      },
    });

    updateTag("support-engineers");

    return {
      success: true,
      message: "Специалист техподдержки успешно добавлен",
      error: null,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: null, error: "Системная ошибка" };
  }
};
