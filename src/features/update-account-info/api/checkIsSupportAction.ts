// src/entities/employee/actions/checkIsSupportAction.ts
"use server"

import { prisma } from "@/prisma/prisma-client"
import { getSession } from "@/shared/lib/server-current-user"

export const checkIsSupportAction = async (): Promise<boolean> => {
  try {
    const session = await getSession()
    if (!session?.user) return false

    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    })

    if (!userProfile) return false

    const isStaffMember = await prisma.staffMember.findUnique({
      where: { profileId: userProfile.id },
      select: { id: true },
    })

    return !!isStaffMember
  } catch (error) {
    console.error("❌ [checkIsSupportAction] Ошибка проверки роли инженера:", error)
    return false
  }
}

export const checkIsSupportActionMyProfileId = async (profileId: string): Promise<boolean> => {
  try {
    const session = await getSession()
    if (!session?.user) return false

    const isStaffMember = await prisma.staffMember.findUnique({
      where: { profileId },
      select: { id: true },
    })

    return !!isStaffMember
  } catch (error) {
    console.error("❌ [checkIsSupportActionMyProfileId] Ошибка проверки роли пользователя:", error)
    return false
  }
}
