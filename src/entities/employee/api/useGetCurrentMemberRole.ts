// src/entities/employee/api/useGetCurrentMemberRole.ts
import type { OrgRole } from "@prisma/client"
import { useGetUserMembership } from "./useGetUserMembership"

export function useGetCurrentMemberRole(organizationId?: string | null): OrgRole | null {
  const { data: memberships = [] } = useGetUserMembership()

  if (!organizationId) return null

  const currentMember = memberships.find((m) => m.organizationId === organizationId)

  return (currentMember?.role as OrgRole) || null
}
