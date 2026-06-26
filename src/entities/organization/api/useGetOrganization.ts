"use client";

import { useQueryWithToast } from "@/shared/lib/useQueryWithToast";
import { getOrganization } from "./getOrganization";

export const useGetOrganization = (id: string) => {
  return useQueryWithToast({
    queryKey: ["organization", id],
    queryFn: async () => {
      return await getOrganization(id);
    },
    enabled: !!id,
  });
};
