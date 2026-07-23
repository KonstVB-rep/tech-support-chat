// src/features/send-message/api/useUploadMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MessagesResponse, Message } from "@/entities/chat/api/types";

interface UploadParams {
  files: File[];
  text?: string;
}

export const useUploadMutation = (activeTicketId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ files, text }: UploadParams) => {
      if (!activeTicketId) throw new Error("Chat ID is required");

      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      if (text) formData.append("text", text);

      // ✅ Единый эндпоинт для текста и вложений
      const res = await fetch(`/api/chats/${activeTicketId}/messages`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      return res.json() as Promise<{ message: Message }>;
    },
    onSuccess: (data) => {
      if (!activeTicketId || !data?.message) return;

      queryClient.setQueryData<MessagesResponse>(
        ["messages", activeTicketId],
        (old) => {
          if (!old) return { messages: [data.message], chat: null };

          if (old.messages.some((m) => m.id === data.message.id)) {
            return old;
          }

          return { ...old, messages: [...old.messages, data.message] };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
