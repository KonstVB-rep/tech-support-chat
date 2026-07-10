// src/features/manage-support-engineer/actions/add.ts
"use server";
import { prisma } from "@/prisma/prisma-client";
import { auth } from "@/app/lib/auth";
import { updateTag } from "next/cache";
import { getSession } from "@/shared/lib/server-current-user";
import { supportEngineerFormSchema } from "@/entities/support-engineer";
import { ActionState } from "@/shared/lib/types";

export const addSupportEngineerAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const session = await getSession();
    if (!session?.user)
      return { success: false, message: null, error: "Не авторизован" };

    if (session.user.role.toLowerCase() !== "admin")
      return { success: false, message: null, error: "Доступ запрещен" };

    const rawData = Object.fromEntries(formData.entries());
    const validated = supportEngineerFormSchema.safeParse(rawData);

    if (!validated.success)
      return {
        success: false,
        message: null,
        error: "Ошибка валидации данных",
      };

    const { email, name, password, phone } = validated.data;

    // 🔍 ШАГ 1: Проверка уникальности по всей базе (User и Profile)
    // Ищем строгое совпадение по чистому email, игнорируя архивные хвосты уволенных инженеров
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const existingProfile = await prisma.profile.findUnique({
      where: { email },
    });

    if (existingUser || existingProfile) {
      return {
        success: false,
        message: null,
        error: `Электронная почта "${email}" уже зарегистрирована в системе активным пользователем.`,
      };
    }

    // 🎯 ШАГ 2: Создаём User через Better Auth
    const result = await auth.api.createUser({
      body: {
        email,
        name,
        role: "user", // Для Better Auth все внешние/внутренние люди — "user"
        password,
      },
    });

    if (!result?.user?.id) {
      return {
        success: false,
        message: null,
        error: "Не удалось создать учетную запись в Better Auth",
      };
    }

    // 🚀 ИСПРАВЛЕНО БЕЗ КРАШЕЙ MYSQL (Ошибка P2002 уничтожена):
    // Поскольку Better Auth сам создал Profile, мы обновляем (update) его по userId,
    // и забираем чистый готовый объект!
    const createdProfile = await prisma.profile.update({
      where: { userId: result.user.id },
      data: {
        phone,
        name,
      },
    });

    // 🎯 ШАГ 3: Выдаем удостоверение инженера техподдержки в таблицу-мост!
    await prisma.supportEngineer.create({
      data: {
        profileId: createdProfile.id,
      },
    });

    updateTag("support-engineers");

    return {
      success: true,
      message: `Специалист техподдержки ${name} успешно добавлен`,
      error: null,
    };
  } catch (error) {
    console.error("Ошибка в addSupportEngineerAction:", error);
    return {
      success: false,
      message: null,
      error: "Критическая ошибка базы данных при создании инженера",
    };
  }
};
