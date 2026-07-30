"use client"

import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/app/lib/auth-client"
import { getProfile } from "./getProfile" // ← Укажи правильный путь к твоему server action

export const useMyProfile = () => {
  const { data: session } = authClient.useSession()

  return useQuery({
    queryKey: ["my-profile", session?.user?.id],
    queryFn: () => getProfile(session?.user?.id),
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
  })
}
