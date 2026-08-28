// src/features/manage-staff/actions/update.ts
"use server"

import type { Profile } from "@prisma/client"
import { updateTag } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/app/lib/auth"
import { updateStaffMemberSchema } from "@/entities/staff-member"
import { prisma } from "@/prisma/prisma-client"
import { USER_ROLE } from "@/shared/constants"
import { getSession } from "@/shared/lib/server-current-user"
import type { ActionState } from "@/shared/lib/types"

export const updateStaffMemberAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState & { data?: Profile & { user: { role: string } } }> => {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== USER_ROLE.ADMIN) {
      return {
        success: false,
        message: null,
        error: "Доступ запрещен. Требуются права администратора.",
      }
    }

    const staffMemberId = formData.get("id") as string
    if (!staffMemberId) {
      return {
        success: false,
        message: null,
        error: "Идентификатор сотрудника отсутствует",
      }
    }

    const rawData = Object.fromEntries(formData.entries())

    const parseData = {
      ...rawData,
      role: rawData.role === "true",
    }

    const validated = updateStaffMemberSchema.safeParse(parseData)

    if (!validated.success) {
      return {
        success: false,
        message: null,
        error: "Ошибка валидации переданных данных",
      }
    }

    const { email, name, password, phone, role } = validated.data

    const userRole = role ? USER_ROLE.ADMIN : USER_ROLE.USER

    const staffMember = await prisma.staffMember.findUnique({
      where: { id: staffMemberId },
      include: {
        profile: {
          include: { user: true },
        },
      },
    })

    if (!staffMember) {
      return {
        success: false,
        message: null,
        error: "Сотрудник не найден",
      }
    }

    const userId = staffMember.profile.user.id
    const currentEmail = staffMember.profile.user.email
    const currentName = staffMember.profile.user.name

    const updatePayload: {
      name?: string
      email?: string
      password?: string
      phone?: string
      role?: string
    } = {}

    if (name !== currentName) {
      updatePayload.name = name
    }

    if (email !== currentEmail) {
      updatePayload.email = email
    }

    if (password && password.trim() !== "") {
      updatePayload.password = password.trim()
    }

    if (phone && phone.trim() !== "") {
      updatePayload.phone = phone
    }

    if (userRole !== staffMember.profile.user.role) {
      updatePayload.role = userRole
    }

    // Вызываем Better Auth только если есть изменения для auth-таблицы
    if (Object.keys(updatePayload).length > 0) {
      try {
        await auth.api.adminUpdateUser({
          body: {
            userId,
            data: updatePayload,
          },
          headers: await headers(),
        })
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "body" in error &&
          (error as { body?: { code?: string } }).body?.code ===
            "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
        ) {
          return {
            success: false,
            message: null,
            error: "Этот email уже используется другим сотрудником",
          }
        }
        throw error
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: staffMember.profileId },
      data: {
        name,
        email,
        phone: phone || null,
        user: { update: { role: userRole } },
      },
      include: { user: { select: { role: true } } },
    })

    updateTag("staff")
    updateTag(`staff-${staffMemberId}`)

    return {
      success: true,
      message: "Профиль сотрудника успешно обновлен",
      error: null,
      data: updatedProfile,
    }
  } catch (error) {
    console.error("Ошибка при выполнении updateStaffMemberAction:", error)
    return {
      success: false,
      message: null,
      error: "Критическая ошибка базы данных при сохранении",
    }
  }
}
