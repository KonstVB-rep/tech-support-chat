// src/features/manage-staff/actions/add.ts
"use server"
import { updateTag } from "next/cache"
import { auth } from "@/app/lib/auth"
import { StaffMemberFormSchema } from "@/entities/staff-member"
import { prisma } from "@/prisma/prisma-client"
import { USER_ROLE } from "@/shared/constants"
import { getSession } from "@/shared/lib/server-current-user"
import type { ActionState } from "@/shared/lib/types"

export const addStaffMemberAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const session = await getSession()
    if (!session?.user) return { success: false, message: null, error: "Не авторизован" }

    if (session.user.role.toLowerCase() !== "admin")
      return { success: false, message: null, error: "Доступ запрещен" }

    const rawData = Object.fromEntries(formData.entries())

    const parseData = {
      ...rawData,
      role: rawData.role === "true",
    }

    const validated = StaffMemberFormSchema.safeParse(parseData)

    if (!validated.success)
      return {
        success: false,
        message: null,
        error: "Ошибка валидации данных",
      }

    const { email, name, password, phone, role } = validated.data

    const userRole = role ? USER_ROLE.ADMIN : USER_ROLE.USER

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
        error: `Электронная почта "${email}" уже зарегистрирована в системе активным пользователем.`,
      }
    }

    const result = await auth.api.createUser({
      body: {
        email,
        name,
        role: userRole,
        password,
      },
    })

    if (!result?.user?.id) {
      return {
        success: false,
        message: null,
        error: "Не удалось создать учетную запись в Better Auth",
      }
    }

    const createdProfile = await prisma.profile.update({
      where: { userId: result.user.id },
      data: {
        phone,
        name,
      },
    })

    await prisma.staffMember.create({
      data: {
        profileId: createdProfile.id,
      },
    })

    updateTag("staff")

    return {
      success: true,
      message: `${name} успешно добавлен`,
      error: null,
    }
  } catch (error) {
    console.error("Ошибка в addStaffMemberAction:", error)
    return {
      success: false,
      message: null,
      error: "Критическая ошибка базы данных при создании пользователя",
    }
  }
}
