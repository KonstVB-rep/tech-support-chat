// src/entities/organization/api/getOrganizations.ts
"use server"

import { cacheTag } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/prisma/prisma-client"
import { USER_ROLE } from "@/shared/constants"
import { getSession } from "@/shared/lib/server-current-user"
import type { OrganizationWithCounts } from "../model/types"

const fetchOrganizations = async (): Promise<OrganizationWithCounts[]> => {
  "use cache"
  cacheTag("organizations")

  return prisma.organization.findMany({
    include: {
      _count: {
        select: {
          members: true,
          chats: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export const getOrganizations = async (): Promise<OrganizationWithCounts[]> => {
  const session = await getSession()

  if (!session?.user) {
    redirect("/auth/sign-in?error=unauthorized")
  }

  if (session.user.role !== USER_ROLE.ADMIN) {
    redirect("/?error=forbidden")
  }

  return fetchOrganizations()
}
