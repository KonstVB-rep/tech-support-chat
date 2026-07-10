// src/features/create-topic/api/useGetOrganizationsList.ts
import { getOrganizations } from "@/entities/organization";
import { useQuery } from "@tanstack/react-query";


export function useGetOrganizationsList(isOpen: boolean) {
  return useQuery({
    queryKey: ["organizations-list"],
    queryFn: () => getOrganizations(),
    enabled: isOpen,
    staleTime: 1000 * 60 * 5, 
  });
}
