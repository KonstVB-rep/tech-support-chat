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
      onProgress?.(10);

      const presignedRes = await fetch(
        "/api/chats/[id]/messages/media-upload/route.ts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            chatId,
          }),
        },
      );

      if (!presignedRes.ok) throw new Error("Ошибка получения URL");
      const { url, publicUrl } = await presignedRes.json();

      onProgress?.(30);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percent = 30 + (e.loaded / e.total) * 60;
            onProgress?.(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error("Ошибка загрузки файла"));
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
      const data = await messageRes.json();

      onProgress?.(100);

      // ✅ Возвращаем тип Message из chat-api, а не отдельный UploadedMessage
      return data.message as Message;
    },

    onSuccess: (message) => {
      // ✅ Теперь типы совпадают — нет конфликта UploadedMessage vs Message
      queryClient.setQueryData<MessagesResponse>(
        ["messages", message.chatId],
        (old) => {
          if (!old) return { messages: [message], chat: null };
          if (old.messages.some((m) => m.id === message.id)) return old;
          return {
            ...old,
            messages: [...old.messages, message],
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

// "use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import type { Message, MessagesResponse } from "@/entities/chat/api/chat-api";

// interface UploadParams {
//   chatId: string;
//   file: File;
//   text?: string;
//   onProgress?: (percent: number) => void;
// }

// export const useUploadFile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({ chatId, file, text, onProgress }: UploadParams) => {
//       const formData = new FormData();
//       formData.append("file", file);
//       if (text) formData.append("text", text);

//       // ✅ Прямая загрузка на свой сервер через XHR (прогресс)
//       const result = await new Promise<Message>((resolve, reject) => {
//         const xhr = new XMLHttpRequest();

//         xhr.upload.addEventListener("progress", (e) => {
//           if (e.lengthComputable) {
//             onProgress?.((e.loaded / e.total) * 100);
//           }
//         });

//         xhr.addEventListener("load", () => {
//           if (xhr.status >= 200 && xhr.status < 300) {
//             const data = JSON.parse(xhr.responseText);
//             resolve(data.message);
//           } else {
//             reject(new Error(JSON.parse(xhr.responseText).error || "Ошибка загрузки"));
//           }
//         });

//         xhr.addEventListener("error", () => reject(new Error("Ошибка сети")));

//         xhr.open("POST", `/api/chats/${chatId}/messages/media-upload`);
//         xhr.send(formData);
//       });

//       return result;
//     },

//     onSuccess: (message) => {
//       queryClient.setQueryData<MessagesResponse>(
//         ["messages", message.chatId],
//         (old) => {
//           if (!old) return { messages: [message], chat: null };
//           if (old.messages.some((m) => m.id === message.id)) return old;
//           return { ...old, messages: [...old.messages, message] };
//         },
//       );
//       queryClient.invalidateQueries({ queryKey: ["chats"] });
//     },
//   });
// };
