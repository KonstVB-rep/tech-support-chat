"use client";

import { useQueryWithToast } from "@/shared/lib/useQueryWithToast";
import { getOrganizations } from "./getOrganizations";

export const useGetOrganizations = () => {
  return useQueryWithToast({
    queryKey: ["organizations"],
    queryFn: async () => {
      return await getOrganizations();
    },
  });
};
