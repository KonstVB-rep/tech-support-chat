"use server"

import { cacheLife, cacheTag } from "next/cache"
import { prisma } from "@/prisma/prisma-client"
import { getSession } from "@/shared/lib/server-current-user"

export const getIsStaffMemberAction = async (): Promise<boolean> => {
  "use cache"
  cacheTag("staff-role")
  cacheLife("hours") // ✅ Кэшируем — роль не меняется, это безопасно

  try {
    const session = await getSession()
    if (!session?.user) return false

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) return false

    const staffRecord = await prisma.staffMember.findUnique({
      where: { profileId: profile.id },
    })

    return !!staffRecord
  } catch (error) {
    console.error("Ошибка проверки роли пользователя:", error)
    return false
  }
}
