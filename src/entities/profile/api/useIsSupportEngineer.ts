import { useQuery } from "@tanstack/react-query"
import { useCurrentUser } from "@/shared/lib/hooks/useCurrentUser"
import { getIsSupportEngineerAction } from "./getIsSupportEngineerAction"

export const useIsSupportEngineer = () => {
  const session = useCurrentUser()

  return useQuery({
    queryKey: ["is-support-engineer", session?.user?.id],
    queryFn: async () => await getIsSupportEngineerAction(),
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    initialData: false,
  })
}
