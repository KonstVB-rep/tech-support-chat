import { useQuery } from "@tanstack/react-query"
import { getIsStaffMemberAction } from "@/entities/profile/api/getIsStaffMemberAction"
import { useCurrentUser } from "@/shared/lib/hooks/useCurrentUser"

export const useIsStaffMember = () => {
  const session = useCurrentUser()

  return useQuery({
    queryKey: ["is-staff-member", session?.user?.id],
    queryFn: async () => await getIsStaffMemberAction(),
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    initialData: false,
  })
}
