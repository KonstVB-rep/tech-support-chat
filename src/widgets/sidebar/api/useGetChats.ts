// src/widgets/sidebar/api/useGetChats.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { connectSocket } from "@/shared/lib/socket";
import { authClient } from "@/app/lib/auth-client";

export interface Chat {
  id: string;
  title: string | null;
  imageUrl: string | null;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  _count: {
    messages: number;
  };
}

const fetchChats = async (): Promise<Chat[]> => {
  const res = await fetch("/api/chats/get");
  if (!res.ok) throw new Error("Ошибка загрузки чатов");
  const data = await res.json();
  return data.chats || data;
};

export const useGetChats = () => {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const query = useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    if (!session?.user?.id) return;

    const socket = connectSocket(session.user.id);

    // Новый чат создан
    const handleNewChat = (chat: Chat) => {
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return [chat];
        if (old.some((c) => c.id === chat.id)) return old;
        return [chat, ...old];
      });
    };

    // ✅ Чат обновился (новое сообщение)
    const handleChatUpdated = (data: { chatId: string }) => {
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return old;

        return old
          .map((chat) => {
            if (chat.id === data.chatId) {
              return {
                ...chat,
                updatedAt: new Date().toISOString(),
                _count: {
                  ...chat._count,
                  messages: chat._count.messages + 1,
                },
              };
            }
            return chat;
          })
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          );
      });
    };

    socket.on("chat:new", handleNewChat);
    socket.on("chat:updated", handleChatUpdated);

    return () => {
      socket.off("chat:new", handleNewChat);
      socket.off("chat:updated", handleChatUpdated);
    };
  }, [queryClient, session?.user?.id]);

  return query;
};
