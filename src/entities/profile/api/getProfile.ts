"use server"

import { cacheTag } from "next/cache"
import { prisma } from "@/prisma/prisma-client"

export const getProfile = async (id: string) => {
  "use cache"
  cacheTag(`profile-${id}`)

  if (!id) {
    return null
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            email: true,
            role: true,
          },
        },
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    })

    if (!profile) {
      return null
    }

    return profile
  } catch (error) {
    console.error("Failed to fetch profile:", error)
    throw new Error("Не удалось загрузить профиль")
  }
}
