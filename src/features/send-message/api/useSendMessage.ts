// src/features/send-message/api/useSendMessage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Message, MessagesResponse } from "@/entities/chat/api/chat-api";
import { apiConfig } from "@/shared/api/config";

type SendMessageParams = {
  chatId: string;
  text: string;
};

export const useSendMessage = (activeTicketId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, text }: SendMessageParams) => {
      const res = await fetch(
        `/api/chats/${chatId}/messages`,
        apiConfig.post({ text }),
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      return res.json() as Promise<{ message: Message }>;
    },
    onSuccess: (data) => {
      const chatId = data?.message?.chatId ?? activeTicketId;

      if (chatId && data?.message) {
        queryClient.setQueryData<MessagesResponse>(
          ["messages", chatId],
          (old) => {
            if (!old) return { messages: [data.message], chat: null };
            if (old.messages.some((m) => m.id === data.message.id)) return old;
            return {
              ...old,
              messages: [...old.messages, data.message],
            };
          },
        );
      }
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
