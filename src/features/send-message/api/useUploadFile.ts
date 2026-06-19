// src/features/send-message/api/useUploadFile.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/shared/lib/socket";

export interface Message {
  id: string;
  text: string;
  chatId: string;
  profileId: string;
  fileUrl: string | null;
  fileType: string | null;
  fileName: string | null;
  fileSize: number | null;
  createdAt: string;
  profile: {
    id: string;
    name: string;
    userId: string;
    imageUrl: string | null;
  };
}

interface UploadResponse {
  message: Message;
}

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
      onProgress?.(10);

      const presignedRes = await fetch("/api/upload/presigned-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          chatId,
        }),
      });

      if (!presignedRes.ok) throw new Error("Ошибка получения URL");
      const { url, publicUrl } = await presignedRes.json();

      onProgress?.(30);

      const xhr = new XMLHttpRequest();

      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = 30 + (e.loaded / e.total) * 60;
            onProgress?.(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error("Ошибка загрузки файла"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Ошибка сети")));
        xhr.addEventListener("abort", () =>
          reject(new Error("Загрузка отменена")),
        );

        xhr.open("PUT", url);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      onProgress?.(95);

      const fileType = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "file";

      const messageRes = await fetch(`/api/chats/${chatId}/messages/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: publicUrl,
          fileType,
          fileName: file.name,
          fileSize: file.size,
          text,
        }),
      });

      if (!messageRes.ok) throw new Error("Ошибка сохранения");
      const data: UploadResponse = await messageRes.json();

      onProgress?.(100);

      return data.message;
    },
    onSuccess: (message) => {
      // ✅ Типизировано без any
      queryClient.setQueryData<Message[]>(
        ["messages", message.chatId],
        (old) => {
          const current = old ?? [];
          if (current.some((m) => m.id === message.id)) return current;
          return [...current, message];
        },
      );

      const socket = getSocket();
      if (socket?.connected) {
        socket.emit("message:new", message);
      }
    },
  });
};
