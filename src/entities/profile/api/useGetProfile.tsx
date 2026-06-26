'use client';

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./getProfile";


export const useGetProfile = (id: string) => {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => {
        console.log(id, 'id');
        return getProfile(id)
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,  // 5 минут кэш
    gcTime: 1000 * 60 * 30,    // 30 минут хранить в кэше
  });
};