// src/features/send-message/api/useSendMessage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Chat, Message, MessagesResponse } from "@/entities/chat/api/types"

type SendMessageParams = {
  chatId: string
  text: string
}

export const useSendMessage = (activeTicketId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ chatId, text }: SendMessageParams) => {
      const formData = new FormData()
      formData.append("text", text)

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
        queryClient.setQueryData<MessagesResponse>(["messages", chatId], (old) => {
          if (!old) return { messages: [data.message], chat: null }
          if (old.messages.some((m) => m.id === data.message.id)) return old
          return {
            ...old,
            messages: [...old.messages, data.message],
          }
        })
      }

      // ✅ Сброс unreadCount при отправке собственного сообщения
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return old
        return old.map((chat) =>
          chat.id === chatId
            ? { ...chat, unreadCount: 0, lastReadAt: new Date().toISOString() }
            : chat,
        )
      })
    },
  })
}
