// src/widgets/sidebar/api/useGetChatById.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchChatInfo } from "@/entities/chat/api/fetchClient"

export const useGetChatById = ({ chatId }: { chatId: string | null }) => {
  return useQuery({
    queryKey: ["chatInfo", chatId],
    queryFn: () => {
      if (!chatId) return
      return fetchChatInfo(chatId)
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    enabled: !!chatId,
  })
}
