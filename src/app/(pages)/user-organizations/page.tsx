// src/app/(pages)/user-organizations/page.tsx

import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProfile } from "@/entities/profile/api/getProfile"
import { prisma } from "@/prisma/prisma-client"
import { getCurrentUser } from "@/shared/lib/server-current-user"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"
import { OrganizationList } from "./ui/OrganizationList"

const UserOrganizationsPage = () => {
  return (
    <div className="w-full">
      <WrapperHeaderScreen>
        <h2 className="flex-1 text-center font-semibold uppercase">Карточка компании</h2>
      </WrapperHeaderScreen>

      <Suspense fallback={<PageSkeleton />}>
        <UserOrganizationsContent />
      </Suspense>
    </div>
  )
}

async function UserOrganizationsContent() {
  const user = await getCurrentUser()
  if (!user) return notFound()

  const hasAccess = await checkOrganizationAccess(user)
  if (!hasAccess) return notFound()

  const profile = await getProfile(user.id)

  return (
    <Suspense fallback={<OrganizationListSkeleton />}>
      <OrganizationList organizations={profile?.organizationMembers ?? []} />
    </Suspense>
  )
}

async function checkOrganizationAccess(user: { id: string; role?: string }): Promise<boolean> {
  if (user.role?.toLowerCase() === "admin") return true

  const membership = await prisma.organizationMember.findFirst({
    where: {
      profile: { userId: user.id },
      role: "RESPONSIBLE",
    },
    select: { id: true },
  })

  return !!membership
}

function PageSkeleton() {
  return (
    <div className="max-h-1/2 min-h-full animate-pulse space-y-3 overflow-y-auto p-3">
      {[1, 2, 3].map((i) => (
        <div className="h-24 rounded-xl bg-muted" key={i} />
      ))}
    </div>
  )
}

function OrganizationListSkeleton() {
  return (
    <div className="max-h-1/2 min-h-full animate-pulse space-y-3 overflow-y-auto p-3">
      {[1, 2, 3].map((i) => (
        <div className="h-24 rounded-xl bg-muted" key={i} />
      ))}
    </div>
  )
}

export default UserOrganizationsPage
