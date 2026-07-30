// src/features/create-topic/api/useGetOrganizationsList.ts

import { useQuery } from "@tanstack/react-query"
import { getOrganizations } from "@/entities/organization"

export function useGetOrganizationsList(isOpen: boolean) {
  return useQuery({
    queryKey: ["organizations-list"],
    queryFn: () => getOrganizations(),
    enabled: isOpen,
    staleTime: 1000 * 60 * 5,
  })
}
