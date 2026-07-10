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
  organization?: {
    id: string;
    name: string;
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

    // Подключаемся к серверу 4000
    const socket = connectSocket(session.user.id);

    // 1. Обработчик: Новый чат создан для RESPONSIBLE или MEMBER
    const handleNewChat = (chat: Chat) => {
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return [chat];
        if (old.some((c) => c.id === chat.id)) return old; // Защита от дубликатов
        return [chat, ...old]; // Кидаем чат на первое место в сайдбаре
      });
    };

    // 2. Обработчик: Новый чат создан тобой (Админом)
    const handleAdminNewChat = (chat: Chat) => {
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return [chat];
        if (old.some((c) => c.id === chat.id)) return old;
        return [chat, ...old];
      });
    };

    // 3. Обработчик: Чат обновился (прилетело новое сообщение)
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

    // 4. 🚀 НОВЫЙ ОБРАБОТЧИК: Сотрудника удалили из участников чата в реальном времени!
    const handleChatRemoved = (data: { chatId: string }) => {
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return [];
        // Мгновенно стираем плашку чата с экрана без перезагрузки
        return old.filter((chat) => chat.id !== data.chatId);
      });
    };

    // 🔥 ИДЕАЛЬНАЯ РЕГИСТРАЦИЯ СЛУШАТЕЛЕЙ (Без дублей)
    socket.on("chat:new", handleNewChat);
    socket.on("chat:admin:new", handleAdminNewChat);
    socket.on("chat:updated", handleChatUpdated);
    socket.on("chat:removed", handleChatRemoved); // Слушаем команду удаления

    // 🎯 КРИТИЧЕСКАЯ ОЧИСТКА ПАМЯТИ: Снимаем абсолютно ВСЕ сокет-провода при размонтировании сайдбара
    return () => {
      socket.off("chat:new", handleNewChat);
      socket.off("chat:admin:new", handleAdminNewChat);
      socket.off("chat:updated", handleChatUpdated);
      socket.off("chat:removed", handleChatRemoved);
    };
  }, [queryClient, session?.user?.id]);

  return query;
};
