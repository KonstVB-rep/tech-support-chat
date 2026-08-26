// src/features/send-message/api/useSendMessage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Message } from "@/entities/chat/api/types"
import { addMessageToCache, resetUnreadCount } from "@/shared/lib/updateMessagesCache"

type SendMessageParams = {
  chatId: string
  text: string
  replyToId?: string
}

export const useSendMessage = (activeTicketId: string | null | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ chatId, text, replyToId }: SendMessageParams) => {
      const formData = new FormData()
      formData.append("text", text)
      if (replyToId) {
        formData.append("replyToId", replyToId)
      }

      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      return res.json() as Promise<{ message: Message }>
    },
    onSuccess: (data) => {
      const chatId = data?.message?.chatId ?? activeTicketId

      if (chatId && data?.message) {
        addMessageToCache(queryClient, chatId, data.message)
        resetUnreadCount(queryClient, chatId)
      }
    },
  })
}
