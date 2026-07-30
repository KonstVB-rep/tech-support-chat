// src/features/manage-employee/actions/add.ts
"use server"
import { updateTag } from "next/cache"
import { auth } from "@/app/lib/auth"
import { employeeFormSchema } from "@/entities/employee"
import { prisma } from "@/prisma/prisma-client"
import { getSession } from "@/shared/lib/server-current-user"
import type { ActionState, UserRoleTypes } from "@/shared/lib/types"
import { EMPLOYEE_MANAGE_ACTIONS, hasEmployeeManagePermission } from "../lib/checkPermission"

export const addEmployeeAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, message: null, error: "Не авторизован" }
    }

    const organizationId = formData.get("organizationId") as string
    if (!organizationId) {
      return {
        success: false,
        message: null,
        error: "Идентификатор организации отсутствует",
      }
    }

    // Проверяем права менеджера
    const check = await hasEmployeeManagePermission({
      user: { id: session.user.id, role: session.user.role as UserRoleTypes },
      organizationId,
      actionType: EMPLOYEE_MANAGE_ACTIONS.CREATE,
    })

    if (!check.allowed) {
      return { success: false, message: null, error: check.error }
    }

    const rawData = Object.fromEntries(formData.entries())
    const validated = employeeFormSchema.safeParse(rawData)

    if (!validated.success) {
      return {
        success: false,
        message: null,
        error: "Ошибка валидации данных сотрудника",
      }
    }

    const { email, name, phone, position, password, role } = validated.data

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    })

    if (!organization) {
      return {
        success: false,
        message: null,
        error: "Указанная organization не найдена",
      }
    }

    // 🔍 ШАГ 1: Жесткая проверка уникальности по всей базе User и Profile
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    const existingProfile = await prisma.profile.findUnique({
      where: { email },
    })

    if (existingUser || existingProfile) {
      return {
        success: false,
        message: null,
        error: `Электронная почта "${email}" уже зарегистрирована в системе. Использовать её для нового сотрудника нельзя из соображений безопасности.`,
      }
    }

    // ШАГ 2: Создаем аккаунт в Better Auth
    const newUser = await auth.api.createUser({
      body: {
        email,
        name,
        role: "user",
        password,
      },
    })

    if (!newUser || !newUser.user) {
      return {
        success: false,
        message: null,
        error: "Не удалось создать учетную запись в Better Auth",
      }
    }

    const createdProfile = await prisma.profile.update({
      where: { userId: newUser.user.id },
      data: {
        phone: phone || null,
      },
    })

    // 🎯 ШАГ 3: Создаем строчку-связь в таблице-мосте
    await prisma.organizationMember.create({
      data: {
        organizationId,
        profileId: createdProfile.id,
        role: role as "RESPONSIBLE" | "MEMBER",
        position: position || null,
      },
    })

    updateTag(`employees-${organizationId}`)

    return {
      success: true,
      message: `Сотрудник ${name} успешно зарегистрирован и добавлен в организацию`,
      error: null,
    }
  } catch (error) {
    console.error("Ошибка в addEmployeeAction:", error)
    return {
      success: false,
      message: null,
      error: "Критическая ошибка базы данных при создании сотрудника",
    }
  }
}
