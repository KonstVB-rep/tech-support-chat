// src/features/manage-employee/actions/update.ts
"use server";
import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";

import { updateTag } from "next/cache";

import { ActionState, UserRoleTypes } from "@/shared/lib/types";
import { hasEmployeeManagePermission } from "../lib/checkPermission";
import { employeeFormSchema } from "@/entities/employee";

export const updateEmployeeAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    // 1. Проверяем сессию и права администратора
    const session = await getSession();
    if (!session?.user) {
      return { success: false, message: null, error: "Не авторизован" };
    }

    // Достаем технические идентификаторы из FormData
    const employeeId = formData.get("employeeId") as string;
    const organizationId = formData.get("organizationId") as string;

    const check = await hasEmployeeManagePermission({
      user: { id: session.user.id, role: session.user.role as UserRoleTypes },
      organizationId,
      targetEmployeeId: employeeId,
      isDeleteAction: false,
    });

    if (!check.allowed) {
      return { success: false, message: null, error: check.error };
    }

    if (!employeeId || !organizationId) {
      return {
        success: false,
        message: null,
        error: "Отсутствуют необходимые идентификаторы сотрудника или компании",
      };
    }

    const rawData = Object.fromEntries(formData.entries());

    const validated = employeeFormSchema.safeParse(rawData);

    console.log(validated.error, "validated");

    if (!validated.success) {
      return {
        success: false,
        message: null,
        error: "Ошибка валидации переданных данных формы",
      };
    }

    const { name, phone, position, role } = validated.data;

    // 3. Проверяем существование связи сотрудника с организацией в MySQL Beget
    const employee = await prisma.organizationMember.findUnique({
      where: { id: employeeId, organizationId },
    });

    if (!employee) {
      return {
        success: false,
        message: null,
        error: "Сотрудник в данной организации не найден",
      };
    }

    // 4. ТРАНЗАКЦИЯ: Синхронно и атомарно обновляем таблицы-мосты и глобальный профиль
    await prisma.$transaction([
      // Обновляем локальные данные членства в компании (роль и должность)
      prisma.organizationMember.update({
        where: { id: employeeId },
        data: {
          position: position || null,
          role: role,
        },
      }),
      // Обновляем общие персональные данные (имя и телефон)
      prisma.profile.update({
        where: { id: employee.profileId },
        data: {
          name,
          phone: phone || null,
        },
      }),
    ]);

    // 5. РЕВАЛИДАЦИЯ: Моментально сбрасываем серверный кэш таблицы сотрудников этой компании
    updateTag(`employees-${organizationId}`);

    return {
      success: true,
      message: `Данные сотрудника ${name} успешно сохранены`,
      error: null,
    };
  } catch (error) {
    console.error("Ошибка при выполнении updateEmployeeAction:", error);
    return {
      success: false,
      message: null,
      error: "Критическая ошибка базы данных при сохранении профиля сотрудника",
    };
  }
};
