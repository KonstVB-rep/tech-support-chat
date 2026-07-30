"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/prisma/prisma-client"
import { USER_ROLE } from "@/shared/constants"
import { getSession } from "@/shared/lib/server-current-user"

export type PushSettingsSource = "organization" | "account" | "admin-staff"

type Payload = {
  targetProfileId: string
  pushEnabled: boolean
  source: PushSettingsSource
  organizationId?: string
}

export const updatePushSettingsAction = async ({
  targetProfileId,
  pushEnabled,
  source,
  organizationId,
}: Payload) => {
  try {
    const session = await getSession()
    if (!session?.user) return { success: false, error: "Не авторизован" }

    const isTargetSupport = await prisma.supportEngineer.findUnique({
      where: { profileId: targetProfileId },
    })

    const isAdmin = session.user.role.toLowerCase() === USER_ROLE.ADMIN.toLowerCase()

    if (isTargetSupport && !isAdmin)
      return {
        success: false,
        error: "Инженерам запрещено отключать уведомления. Обратитесь к администратору.",
      }

    const myProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!isAdmin && myProfile?.id !== targetProfileId) {
      return {
        success: false,
        error: "Можно изменять только свои настройки",
      }
    }

    await prisma.profile.update({
      where: { id: targetProfileId },
      data: { pushEnabled },
    })

    switch (source) {
      case "organization":
        if (organizationId) {
          revalidatePath(`/organization/${organizationId}`)
        }
        break
      case "account":
        revalidatePath("/account")
        break
      case "admin-staff":
        revalidatePath("/admin/staff")
        break
    }

    return { success: true, error: null }
  } catch (e) {
    console.error("Ошибка updatePushSettings:", e)
    return { success: false, error: "Ошибка сервера" }
  }
}
