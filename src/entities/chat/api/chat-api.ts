// src/entities/chat/api/chat-api.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Типы
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  profileId: string;
}

export interface ChatInfo {
  id: string;
  title: string | null;
  imageUrl: string | null;
}

export interface Message {
  id: string;
  text: string;
  chatId: string;
  profileId: string;
  createdAt: string;
  fileUrl?: string | null;
  fileType?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  profile: {
    id: string;
    name: string;
    userId: string;
    imageUrl: string | null;
    user?: { role: string };
  };
}

export interface MessagesResponse {
  messages: Message[];
  chat: {
    id: string;
    title: string | null;
    organizationId: string | null;
    organization: {
      name: string;
    } | null;
  } | null;
}

// API функции
export const fetchSession = async (): Promise<User> => {
  const res = await fetch("/api/auth/get-session");
  if (!res.ok) throw new Error("Не авторизован");
  const data = await res.json();
  if (!data.user) throw new Error("Нет пользователя");
  return data.user;
};

export const fetchActiveChat = async (): Promise<string | null> => {
  const res = await fetch("/api/chats/active");
  if (!res.ok) throw new Error("Ошибка получения чата");
  const data = await res.json();
  return data.chatId;
};

export const fetchChatInfo = async (chatId: string): Promise<ChatInfo> => {
  const res = await fetch(`/api/chats/${chatId}/info`);
  if (!res.ok) throw new Error("Чат не найден");
  const data = await res.json();
  return data.chat;
};

export const fetchMessages = async (
  chatId: string,
): Promise<MessagesResponse> => {
  const res = await fetch(`/api/chats/${chatId}/messages`);

  if (!res.ok) throw new Error("Ошибка загрузки сообщений");

  return await res.json();
};

export const sendMessage = async (
  chatId: string,
  text: string,
): Promise<Message> => {
  const res = await fetch(`/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Ошибка отправки");
  const data = await res.json();
  return data.message;
};

// Хуки
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

    // ✅ ИСПРАВЛЕНИЕ #2 и #3: Оптимистичное обновление + правильная инвалидация
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

    onError: (err, variables, context) => {
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
