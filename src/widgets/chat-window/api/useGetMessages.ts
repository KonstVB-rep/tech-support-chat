// src/widgets/chat-window/api/useGetMessages.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSocket } from "@/shared/lib/socket";
import { authClient } from "@/app/lib/auth-client";

interface Message {
  id: string;
  text: string;
  chatId: string;
  profileId: string;
  createdAt: string;
  profile?: {
    id: string;
    name: string;
    userId: string;
    imageUrl?: string;
  };
}

const fetchMessages = async (ticketId: string | null): Promise<Message[]> => {
  if (!ticketId) return [];

  const res = await fetch(`/api/chats/${ticketId}/messages`);
  if (!res.ok) throw new Error("Ошибка загрузки сообщений");
  const data = await res.json();
  return data.messages;
};

export function useGetMessages(ticketId: string | null) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const query = useQuery({
    queryKey: ["messages", ticketId],
    queryFn: () => fetchMessages(ticketId),
    enabled: !!ticketId,
    staleTime: 0,
  });

  // ✅ Socket.IO подписка
  useEffect(() => {
    if (!ticketId || !session?.user?.id) return;

    const socket = getSocket();
    if (!socket) return;

    // Подключаемся если нужно
    if (!socket.connected) {
      socket.auth = { userId: session.user.id };
      socket.connect();
    }

    // Присоединяемся к комнате чата
    socket.emit("chat:join", ticketId);

    // ✅ Слушаем новые сообщения
    const handleNewMessage = (msg: Message) => {
      if (msg.chatId === ticketId) {
        queryClient.setQueryData<Message[]>(["messages", ticketId], (old) => {
          if (!old) return [msg];
          if (old.some((m) => m.id === msg.id)) return old; // Защита от дублей
          return [...old, msg];
        });
      }
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.emit("chat:leave", ticketId);
    };
  }, [ticketId, queryClient, session?.user?.id]);

  return query;
}
