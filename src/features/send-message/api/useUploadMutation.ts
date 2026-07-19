// src/features/send-message/api/useUploadFile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Message, MessagesResponse } from "@/entities/chat/api/chat-api";

type MediaUploadResponse = {
  messages: Message[];
};

type UploadParams = {
  chatId: string;
  files: File[];
  text?: string;
};

export const useUploadMutation = (activeTicketId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, files, text: msgText }: UploadParams) => {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      if (msgText) formData.append("text", msgText);

      const res = await fetch(`/api/chats/${chatId}/messages/media-upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      return res.json() as Promise<MediaUploadResponse>;
    },
    onSuccess: (data) => {
      // ✅ Используем chatId из ответа сервера, а не из замыкания
      const chatId = data?.messages?.[0]?.chatId ?? activeTicketId;

      if (chatId && data?.messages) {
        queryClient.setQueryData<MessagesResponse>(
          ["messages", chatId],
          (old) => {
            if (!old) return { messages: data.messages, chat: null };
            const existingIds = new Set(old.messages.map((m) => m.id));
            const newMsgs = data.messages.filter((m) => !existingIds.has(m.id));
            return { ...old, messages: [...old.messages, ...newMsgs] };
          },
        );
      }
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
