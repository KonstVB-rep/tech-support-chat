// src/widgets/sidebar/api/useGetChats.ts
"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getSocket } from "@/shared/lib/socket";
import { authClient } from "@/app/lib/auth-client";
import { fetchChats } from "@/entities/chat/api/fetchClient";
import type { Chat } from "@/entities/chat/api/types";
import { useChatStore } from "@/store/useChatStore";

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

    const socket = getSocket();

    const handleChatUpdated = (data: {
      chatId: string;
      updatedAt: string;
      senderId?: string;
      lastMessage?: Chat["lastMessage"];
    }) => {
      const currentActiveId = useChatStore.getState().activeTicketId;

      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return old;

        return old
          .map((chat) => {
            if (chat.id !== data.chatId) return chat;

            const isOwnMessage = data.senderId === session.user?.id;
            const isActiveChat = chat.id === currentActiveId;

            let newUnread = chat.unreadCount ?? 0;
            if (isOwnMessage || isActiveChat) {
              newUnread = 0;
            } else {
              newUnread += 1;
            }

            return {
              ...chat,
              updatedAt: data.updatedAt,
              lastMessage: data.lastMessage ?? chat.lastMessage,
              unreadCount: newUnread,
              _count: {
                ...chat._count,
                messages: chat._count.messages + 1,
              },
            };
          })
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          );
      });
    };

    const handleNewChat = (chat: Chat) => {
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return [chat];
        if (old.some((c) => c.id === chat.id)) return old;
        return [chat, ...old];
      });
    };

    const handleAdminNewChat = (chat: Chat) => {
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return [chat];
        if (old.some((c) => c.id === chat.id)) return old;
        return [chat, ...old];
      });
    };

    const handleChatRemoved = (data: { chatId: string }) => {
      queryClient.setQueryData<Chat[]>(["chats"], (old) => {
        if (!old) return [];
        return old.filter((chat) => chat.id !== data.chatId);
      });
    };

    socket.on("chat:updated", handleChatUpdated);
    socket.on("chat:new", handleNewChat);
    socket.on("chat:admin:new", handleAdminNewChat);
    socket.on("chat:removed", handleChatRemoved);

    return () => {
      socket.off("chat:updated", handleChatUpdated);
      socket.off("chat:new", handleNewChat);
      socket.off("chat:admin:new", handleAdminNewChat);
      socket.off("chat:removed", handleChatRemoved);
    };
  }, [queryClient, session?.user?.id]);

  return query;
};
