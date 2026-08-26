// src/features/manage-support-engineer/actions/update.ts
"use server"

import type { Profile } from "@prisma/client"
import { updateTag } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/app/lib/auth"
import { updateSupportEngineerSchema } from "@/entities/support-engineer"
import { prisma } from "@/prisma/prisma-client"
import { USER_ROLE } from "@/shared/constants"
import { getSession } from "@/shared/lib/server-current-user"
import type { ActionState } from "@/shared/lib/types"

export const updateSupportEngineerAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState & { data?: Profile }> => {
  try {
    const session = await getSession()

    if (!session?.user || session.user.role !== USER_ROLE.ADMIN) {
      return {
        success: false,
        message: null,
        error: "Доступ запрещен. Требуются права администратора.",
      }
    }

    const engineerId = formData.get("id") as string
    if (!engineerId) {
      return {
        success: false,
        message: null,
        error: "Идентификатор сотрудника отсутствует",
      }
    }

    const rawData = Object.fromEntries(formData.entries())
    const validated = updateSupportEngineerSchema.safeParse(rawData)

    if (!validated.success) {
      return {
        success: false,
        message: null,
        error: "Ошибка валидации переданных данных",
      }
    }

    const { email, name, password, phone } = validated.data

    const engineer = await prisma.supportEngineer.findUnique({
      where: { id: engineerId },
      include: {
        profile: {
          include: { user: true },
        },
      },
    })

    if (!engineer) {
      return {
        success: false,
        message: null,
        error: "Сотрудник не найден",
      }
    }

    const userId = engineer.profile.user.id
    const currentEmail = engineer.profile.user.email
    const currentName = engineer.profile.user.name

    // Собираем payload ТОЛЬКО из реально изменённых полей
    const updatePayload: { name?: string; email?: string; password?: string } = {}

    if (name !== currentName) {
      updatePayload.name = name
    }

    if (email !== currentEmail) {
      updatePayload.email = email
    }

    if (password && password.trim() !== "") {
      updatePayload.password = password.trim()
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
      where: { id: engineer.profileId },
      data: { name, email, phone: phone || null },
    })

    updateTag("support-engineers")
    updateTag(`support-engineers-${engineerId}`)

    return {
      success: true,
      message: "Профиль сотрудника успешно обновлен",
      error: null,
      data: updatedProfile,
    }
  } catch (error) {
    console.error("Ошибка при выполнении updateSupportEngineerAction:", error)
    return {
      success: false,
      message: null,
      error: "Критическая ошибка базы данных при сохранении",
    }
  }
}
