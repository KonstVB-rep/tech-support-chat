import { useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { fetchMessages } from "@/entities/chat/api/fetchClient"
import type { ChatItem } from "@/entities/chat/api/types"
import {
  useActiveTicketId,
  useSetActiveTicketId,
  useSetCurrentOrganization,
} from "@/store/useChatStore"

// src/entities/chat/lib/useChatListActions.ts
export function useChatListActions() {
  const activeTicketId = useActiveTicketId()
  const setActiveTicketId = useSetActiveTicketId()
  const setCurrentOrganization = useSetCurrentOrganization()
  const queryClient = useQueryClient()

  const handlePrefetch = useCallback(
    (chatId: string) => {
      queryClient.prefetchQuery({
        queryKey: ["messages", chatId],
        queryFn: () => fetchMessages(chatId),
        staleTime: 60_000,
      })
    },
    [queryClient],
  )

  const handleChatSelect = useCallback(
    (chat: ChatItem) => {
      setActiveTicketId(chat.id)
      setCurrentOrganization(chat.organization?.id ?? null, chat.memberRole)
      queryClient.setQueryData<ChatItem[]>(["chats"], (old) =>
        old?.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c)),
      )
      const params = new URLSearchParams(window.location.search)
      params.set("chat", chat.id)
      window.history.replaceState(null, "", `?${params.toString()}`)
    },
    [setActiveTicketId, setCurrentOrganization, queryClient],
  )

  return { activeTicketId, handlePrefetch, handleChatSelect }
}
