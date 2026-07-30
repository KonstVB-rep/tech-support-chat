// src/widgets/chat-window/api/useGetMessages.ts
"use client"

import { useEffect, useRef } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { authClient } from "@/app/lib/auth-client"
import { fetchMessages } from "@/entities/chat/api/fetchClient"
import type { Message, MessagesResponse } from "@/entities/chat/api/types"
import { getSocket } from "@/shared/lib/socket"

export function useGetMessages(ticketId: string | null) {
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const isMountedRef = useRef(true)

  const query = useQuery<MessagesResponse>({
    queryKey: ["messages", ticketId],
    queryFn: async () => {
      if (!ticketId) throw new Error("ticketId is required")
      return fetchMessages(ticketId)
    },
    enabled: !!ticketId,
    staleTime: 0,
  })

  useEffect(() => {
    isMountedRef.current = true

    if (!ticketId || !session?.user?.id) return

    const socket = getSocket()
    let hasJoined = false

    const joinChat = () => {
      if (!isMountedRef.current || hasJoined) return
      hasJoined = true
      socket.emit("chat:join", ticketId)
      console.log(`📌 [CLIENT] Присоединился к chat:${ticketId}`)
    }

    if (socket.connected) {
      joinChat()
    } else {
      socket.once("connect", joinChat)
    }

    const handleNewMessage = (msg: Message) => {
      console.log(`💬 [CLIENT] Получил message:new для chat:${msg.chatId}`)

      if (msg.chatId === ticketId) {
        queryClient.setQueryData<MessagesResponse>(["messages", ticketId], (old) => {
          if (!old) return { messages: [msg], chat: null }
          if (old.messages.some((m) => m.id === msg.id)) return old
          return {
            ...old,
            messages: [...old.messages, msg],
          }
        })
      }
    }

    const handleChatRenamed = (data: { chatId: string; newTitle: string }) => {
      if (data.chatId === ticketId) {
        queryClient.setQueryData<MessagesResponse>(["messages", ticketId], (old) => {
          if (!old || !old.chat) return old
          return { ...old, chat: { ...old.chat, title: data.newTitle } }
        })
      }
    }

    socket.on("message:new", handleNewMessage)
    socket.on("chat:renamed", handleChatRenamed)

    return () => {
      isMountedRef.current = false
      socket.off("message:new", handleNewMessage)
      socket.off("chat:renamed", handleChatRenamed)
      socket.off("connect", joinChat)

      if (socket.connected && hasJoined) {
        socket.emit("chat:leave", ticketId)
        console.log(`📤 [CLIENT] Покинул chat:${ticketId}`)
      }
    }
  }, [ticketId, queryClient, session?.user?.id])

  return query
}
