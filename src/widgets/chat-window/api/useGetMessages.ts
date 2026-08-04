// src/widgets/chat-window/api/useGetMessages.ts
"use client"

import { useEffect, useRef } from "react"
import { type InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { authClient } from "@/app/lib/auth-client"
import { fetchMessages } from "@/entities/chat/api/fetchClient"
import type { Message, MessagesResponse } from "@/entities/chat/api/types"
import { getSocket } from "@/shared/lib/socket"
import { addMessageToCache, updateChatTitleInCache } from "@/shared/lib/updateMessagesCache"

export function useGetMessages(ticketId: string | null | undefined) {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const isMountedRef = useRef(true)

  const safeTicketId = ticketId ?? null

  const query = useInfiniteQuery<
    MessagesResponse,
    Error,
    InfiniteData<MessagesResponse, string | null>,
    [string, string | null],
    string | null
  >({
    queryKey: ["messages", safeTicketId],
    queryFn: async ({ pageParam }) => {
      if (!safeTicketId) throw new Error("ticketId is required")

      const params = new URLSearchParams({ limit: "50" })
      if (pageParam) params.set("cursor", pageParam)

      const response = await fetchMessages(safeTicketId, params)

      return {
        messages: Array.isArray(response.messages) ? response.messages : [],
        chat: response.chat ?? null,
        hasMore: response.hasMore ?? false,
        nextCursor: response.nextCursor ?? null,
      }
    },
    enabled: Boolean(safeTicketId) && Boolean(session?.user?.id),
    staleTime: 0,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage || typeof lastPage !== "object") return undefined
      return lastPage.nextCursor ?? undefined
    },
  })

  const allMessages =
    query.data?.pages && Array.isArray(query.data.pages)
      ? query.data.pages
          .slice()
          .reverse()
          .flatMap((page) => {
            if (!page || !Array.isArray(page.messages)) return []
            return page.messages
          })
      : []

  const chatInfo =
    query.data?.pages && Array.isArray(query.data.pages) && query.data.pages[0]
      ? (query.data.pages[0].chat ?? null)
      : null

  useEffect(() => {
    isMountedRef.current = true
    if (!safeTicketId || !session?.user?.id) return

    const socket = getSocket()
    let hasJoined = false

    const joinChat = () => {
      if (!isMountedRef.current || hasJoined) return
      hasJoined = true
      socket.emit("chat:join", safeTicketId)
    }

    if (socket.connected) joinChat()
    else socket.once("connect", joinChat)

    const handleNewMessage = (msg: Message) => {
      if (msg.chatId !== safeTicketId) return
      addMessageToCache(queryClient, safeTicketId, msg)
    }

    const handleChatRenamed = (data: { chatId: string; newTitle: string }) => {
      if (data.chatId !== safeTicketId) return
      updateChatTitleInCache(queryClient, safeTicketId, data.newTitle)
    }

    socket.on("message:new", handleNewMessage)
    socket.on("chat:renamed", handleChatRenamed)

    return () => {
      isMountedRef.current = false
      socket.off("message:new", handleNewMessage)
      socket.off("chat:renamed", handleChatRenamed)
      socket.off("connect", joinChat)
      if (socket.connected && hasJoined) {
        socket.emit("chat:leave", safeTicketId)
      }
    }
  }, [safeTicketId, queryClient, session?.user?.id])

  return {
    messages: allMessages,
    chat: chatInfo,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage ?? false,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
    error: query.error,
  }
}
