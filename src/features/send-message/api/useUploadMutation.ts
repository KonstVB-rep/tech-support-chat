// src/features/send-message/api/useUploadMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Message } from "@/entities/chat/api/types"
import { addMessageToCache, resetUnreadCount } from "@/shared/lib/updateMessagesCache"

interface UploadParams {
  files: File[]
  text?: string
  replyToId?: string
}

export const useUploadMutation = (activeTicketId: string | null | undefined) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ files, text, replyToId }: UploadParams) => {
      if (!activeTicketId) throw new Error("Chat ID is required")

      const formData = new FormData()
      files.forEach((f) => {
        formData.append("files", f)
      })
      if (text) formData.append("text", text)

      if (replyToId) {
        formData.append("replyToId", replyToId)
      }

      const res = await fetch(`/api/chats/${activeTicketId}/messages`, {
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
      if (!activeTicketId || !data?.message) return

      addMessageToCache(queryClient, activeTicketId, data.message)
      resetUnreadCount(queryClient, activeTicketId)
    },
  })
}
