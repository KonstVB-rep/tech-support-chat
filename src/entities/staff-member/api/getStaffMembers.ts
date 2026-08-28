"use server"

import { cacheTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/prisma/prisma-client"
import { USER_ROLE } from "@/shared/constants"
import { getSession } from "@/shared/lib/server-current-user"
import type { StaffMemberWithProfile } from "../model"

const fetchStaffMembersList = async () => {
  "use cache"
  cacheTag("staff")

  return await prisma.staffMember.findMany({
    where: {
      profile: {
        user: {
          isActive: true,
        },
      },
    },
    include: {
      profile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              isActive: true,
              createdAt: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export const getStaffMembers = async (): Promise<StaffMemberWithProfile[]> => {
  const session = await getSession()
  if (!session?.user) {
    redirect("/auth/sign-in?error=unauthorized")
  }

  if (session.user.role !== USER_ROLE.ADMIN) {
    redirect("/?error=forbidden")
  }

  const staffMembers = await fetchStaffMembersList()

  return staffMembers ?? []
}
