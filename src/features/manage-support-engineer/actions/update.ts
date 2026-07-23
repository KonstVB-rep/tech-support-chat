// src/features/manage-support-engineer/actions/update.ts
"use server";
import { prisma } from "@/prisma/prisma-client";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { updateTag } from "next/cache";
import { getSession } from "@/shared/lib/server-current-user";
import { updateSupportEngineerSchema } from "@/entities/support-engineer";
import { ActionState } from "@/shared/lib/types";
import { USER_ROLE } from "@/shared/constants";

export const updateSupportEngineerAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const session = await getSession();

    if (!session?.user || session.user.role !== USER_ROLE.ADMIN) {
      return {
        success: false,
        message: null,
        error: "Доступ запрещен. Требуются права администратора.",
      };
    }

    const engineerId = formData.get("id") as string;
    if (!engineerId) {
      return {
        success: false,
        message: null,
        error: "Идентификатор сотрудника отсутствует",
      };
    }

    const rawData = Object.fromEntries(formData.entries());
    const validated = updateSupportEngineerSchema.safeParse(rawData);

    if (!validated.success) {
      return {
        success: false,
        message: null,
        error: "Ошибка валидации переданных данных",
      };
    }

    const { email, name, password, phone } = validated.data;

    // Сборка объекта изменений строго для вложенного свойства 'data'
    const updatePayload: { email: string; name: string; password?: string } = {
      email,
      name,
    };

    if (password && password.trim() !== "") {
      updatePayload.password = password.trim();
    }

    // 2. 🎯 ВЫЗОВ ИЗ ДОКУМЕНТАЦИИ BETTER AUTH:
    // Поля userId и data лежат внутри body, как требует Admin Plugin
    await auth.api.adminUpdateUser({
      body: {
        userId: engineerId,
        data: updatePayload,
      },
      headers: await headers(),
    });

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: engineerId },
    });

    if (existingProfile) {
      await prisma.profile.update({
        where: { userId: engineerId },
        data: { name, email, phone: phone || null },
      });
    } else {
      await prisma.profile.create({
        data: { userId: engineerId, name, email, phone: phone || null },
      });
    }

    updateTag("support-engineers");
    updateTag(`support-engineers-${engineerId}`);

    return {
      success: true,
      message: "Профиль сотрудника и учетные данные успешно обновлены",
      error: null,
    };
  } catch (error) {
    console.error("Ошибка при выполнении updateSupportEngineerAction:", error);
    return {
      success: false,
      message: null,
      error: "Критическая ошибка базы данных при сохранении на сервере Beget",
    };
  }
};
