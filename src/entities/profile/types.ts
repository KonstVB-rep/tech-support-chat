import type { getProfile } from "./api"

export type OrganizationMembership = NonNullable<
  Awaited<ReturnType<typeof getProfile>>
>["organizationMembers"][number]
