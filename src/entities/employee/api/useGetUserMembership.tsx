// src/entities/employee/api/useGetUserMembership.ts

import { useQuery } from "@tanstack/react-query"
import { getMembershipsAction } from "@/features/manage-employee/actions/getMembersipsAction"

interface Membership {
  organizationId: string
  role: "RESPONSIBLE" | "MEMBER"
  position: string | null
}

export function useGetUserMembership() {
  return useQuery<Membership[]>({
    queryKey: ["current-user-memberships"],
    queryFn: async () => {
      const response = await getMembershipsAction()

      if (!response.success) {
        throw new Error(response.error || "Не удалось загрузить права доступа")
      }

      return response.data as Membership[]
    },
    staleTime: 1000 * 60 * 5, // Кэш на 5 минут в памяти браузера
  })
}
