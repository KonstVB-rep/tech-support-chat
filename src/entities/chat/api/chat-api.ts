// src/entities/chat/api/chat-api.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSession,
  fetchActiveChat,
  fetchChatInfo,
  fetchMessages,
} from "./fetchClient";
import type { Message, MessagesResponse } from "./types";

export const sendMessage = async (
  chatId: string,
  text: string,
): Promise<Message> => {
  const formData = new FormData();
  formData.append("text", text);

  const res = await fetch(`/api/chats/${chatId}/messages`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Ошибка отправки");
  }

  const data = await res.json();
  return data.message;
};
// Хуки без изменений...
export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useActiveChat() {
  return useQuery({
    queryKey: ["activeChat"],
    queryFn: fetchActiveChat,
    staleTime: 30 * 1000,
  });
}

export function useChatInfo(chatId: string | null) {
  return useQuery({
    queryKey: ["chatInfo", chatId],
    queryFn: () => fetchChatInfo(chatId!),
    enabled: !!chatId,
    staleTime: 60 * 1000,
  });
}

export function useMessages(chatId: string | null) {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => fetchMessages(chatId!),
    enabled: !!chatId,
    staleTime: 0,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, text }: { chatId: string; text: string }) =>
      sendMessage(chatId, text),

    onMutate: async ({ chatId, text }) => {
      await queryClient.cancelQueries({ queryKey: ["messages", chatId] });

      const previousData = queryClient.getQueryData<MessagesResponse>([
        "messages",
        chatId,
      ]);

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        text,
        chatId,
        profileId: "me",
        createdAt: new Date().toISOString(),
        attachments: [],
        profile: { id: "me", name: "Вы", imageUrl: "", userId: "" },
      };

      queryClient.setQueryData<MessagesResponse>(
        ["messages", chatId],
        (old) => ({
          messages: [...(old?.messages || []), optimisticMessage],
          chat: old?.chat || null,
        }),
      );

      return { previousData };
    },

    onError: (_err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["messages", variables.chatId],
          context.previousData,
        );
      }
    },

    onSuccess: (serverMessage, variables) => {
      queryClient.setQueryData<MessagesResponse>(
        ["messages", variables.chatId],
        (old) => ({
          messages: (old?.messages || []).map((m) =>
            m.id.startsWith("temp-") ? serverMessage : m,
          ),
          chat: old?.chat || null,
        }),
      );
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
