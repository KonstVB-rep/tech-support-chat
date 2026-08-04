import { useCallback } from "react"
import { type InfiniteData, useQueryClient } from "@tanstack/react-query"
import { fetchMessages } from "@/entities/chat/api/fetchClient"
import type { ChatItem, MessagesResponse } from "@/entities/chat/api/types"
import {
  useActiveTicketId,
  useSetActiveTicketId,
  useSetCurrentOrganization,
} from "@/store/useChatStore"

export function useChatListActions() {
  const activeTicketId = useActiveTicketId()
  const setActiveTicketId = useSetActiveTicketId()
  const setCurrentOrganization = useSetCurrentOrganization()
  const queryClient = useQueryClient()

  const handlePrefetch = useCallback(
    (chatId: string) => {
      queryClient.prefetchInfiniteQuery<
        MessagesResponse,
        Error,
        InfiniteData<MessagesResponse, string | null>,
        [string, string],
        string | null
      >({
        queryKey: ["messages", chatId],
        queryFn: async ({ pageParam }) => {
          const params = new URLSearchParams({ limit: "50" })
          if (pageParam) params.set("cursor", pageParam)
          return await fetchMessages(chatId, params)
        },
        initialPageParam: null,

        getNextPageParam: (lastPage: MessagesResponse) => lastPage.nextCursor ?? undefined,
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
