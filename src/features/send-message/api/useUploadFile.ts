// src/features/send-message/api/useUploadFile.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Message, MessagesResponse } from "@/entities/chat/api/chat-api";

interface UploadParams {
  chatId: string;
  file: File;
  text?: string;
  onProgress?: (percent: number) => void;
}

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, file, text, onProgress }: UploadParams) => {
      const formData = new FormData();
      formData.append("file", file);
      if (text) formData.append("text", text);

      const result = await new Promise<Message>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            onProgress?.((e.loaded / e.total) * 100);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data.message as Message);
            } catch {
              reject(new Error("Некорректный ответ сервера"));
            }
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error || `HTTP ${xhr.status}`));
            } catch {
              reject(new Error(`HTTP ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Ошибка сети")));
        xhr.addEventListener("abort", () =>
          reject(new Error("Загрузка отменена")),
        );

        // ✅ Динамический URL с реальным chatId (не литерал [id])
        xhr.open("POST", `/api/chats/${chatId}/messages/media-upload`);
        xhr.send(formData);
      });

      return result;
    },

    onSuccess: (message) => {
      queryClient.setQueryData<MessagesResponse>(
        ["messages", message.chatId],
        (old) => {
          if (!old) return { messages: [message], chat: null };
          if (old.messages.some((m) => m.id === message.id)) return old;
          return { ...old, messages: [...old.messages, message] };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
