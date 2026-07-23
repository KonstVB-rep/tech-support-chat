// src/entities/chat/ui/SidebarChatList.tsx
"use client";

import Image from "next/image";
import { fetchMessages } from "@/entities/chat/api/fetchClient";
import type { Chat } from "@/entities/chat/api/types";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import { useActiveTicketId, useSetActiveTicketId } from "@/store/useChatStore";
import { ChatWindow } from "@/widgets/chat-window";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type ChatListProps = {
  chats: Chat[];
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (days === 1) return "Вчера";
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
};

export const SidebarChatList = ({ chats }: ChatListProps) => {
  const searchParams = useSearchParams();
  const activeTicketId = useActiveTicketId();
  const setActiveTicketId = useSetActiveTicketId();
  const queryClient = useQueryClient();

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  useEffect(() => {
    const chatFromUrl = searchParams.get("chat");
    if (chatFromUrl && chatFromUrl !== activeTicketId) {
      setActiveTicketId(chatFromUrl);
    } else {
      setActiveTicketId(null);
    }
  }, []);

  useEffect(() => {
    if (!activeTicketId) {
      setIsMobileChatOpen(false);
    }
  }, [activeTicketId]);

  const handlePrefetch = useCallback(
    (chatId: string) => {
      queryClient.prefetchQuery({
        queryKey: ["messages", chatId],
        queryFn: () => fetchMessages(chatId),
        staleTime: 60_000,
      });
    },
    [queryClient],
  );

  const handleChatSelect = (chatId: string) => {
    setActiveTicketId(chatId);

    queryClient.setQueryData<Chat[]>(["chats"], (old) => {
      if (!old) return old;
      return old.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
      );
    });

    const params = new URLSearchParams(window.location.search);
    params.set("chat", chatId);
    window.history.replaceState(null, "", `?${params.toString()}`);

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileChatOpen(true);
    }
  };

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
        <div className="text-3xl mb-2">💬</div>
        <p className="text-xs text-muted-foreground">Нет диалогов</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 select-none flex flex-col gap-1.5">
      {chats.map((chat) => {
        const isActiveDesktop = chat.id === activeTicketId;
        const displayTitle =
          chat.title || chat.organization?.name || "Обращение в поддержку";

        const lastMsg = chat.lastMessage ?? null;
        const attachments = lastMsg?.attachments ?? [];

        const firstImage = attachments.find((a) => a.type.startsWith("image"));
        const firstVideo = attachments.find((a) => a.type.startsWith("video"));
        const firstDoc = attachments.find(
          (a) => !a.type.startsWith("image") && !a.type.startsWith("video"),
        );

        return (
          <Button
            key={chat.id}
            data-chat-id={chat.id}
            onClick={() => handleChatSelect(chat.id)}
            onMouseEnter={() => handlePrefetch(chat.id)}
            className={cn(
              "w-full items-center gap-3 px-3 py-2.5 hover:bg-muted/50 bg-transparent transition-colors text-left h-auto rounded-md flex",
              isActiveDesktop && "md:bg-primary/10 md:hover:bg-primary/15",
            )}
          >
            <Avatar className="w-11 h-11 border border-border/50 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                {displayTitle.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="font-semibold text-sm truncate text-primary">
                  {displayTitle}
                </h3>
                <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                  {lastMsg
                    ? formatTime(lastMsg.createdAt)
                    : formatTime(chat.updatedAt)}
                </span>
              </div>

              {/* Превью в стиле Telegram: миниатюра + текст */}
              <div className="flex items-end justify-between gap-2 mt-1">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {firstImage && (
                    <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-border/30">
                      <Image
                        src={firstImage.url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                        sizes="32px"
                      />
                    </div>
                  )}

                  {!firstImage && firstVideo && (
                    <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-border/30 bg-black/5 flex items-center justify-center">
                      <span className="text-xs">🎥</span>
                    </div>
                  )}

                  {!firstImage && !firstVideo && firstDoc && (
                    <div className="w-8 h-8 rounded flex-shrink-0 border border-border/30 bg-muted/50 flex items-center justify-center">
                      <span className="text-xs">📎</span>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground line-clamp-1 leading-tight min-w-0">
                    {lastMsg?.text ||
                      (firstImage
                        ? "Фото"
                        : firstVideo
                          ? "Видео"
                          : firstDoc
                            ? firstDoc.name
                            : "Нет сообщений")}
                  </p>
                </div>

                {(chat.unreadCount ?? 0) > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center leading-none flex-shrink-0">
                    {chat.unreadCount! > 99 ? "99+" : chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </Button>
        );
      })}

      <DrawerComponent
        open={isMobileChatOpen}
        onOpenChange={setIsMobileChatOpen}
        className="data-[vaul-drawer-direction=left]:sm:max-w-full data-[vaul-drawer-direction=right]:sm:max-w-full data-[vaul-drawer-direction=left]:max-h-[100vh] data-[vaul-drawer-direction=left]:h-[100dvh] md:hidden w-full max-w-full data-[vaul-drawer-direction=left]:w-full h-full"
        side="left"
      >
        <div className="md:px-4 flex flex-col gap-3 relative h-full">
          <div className="absolute right-0 h-3/12 bg-chart-2 rounded-s-md top-1/2 -translate-y-1/2 w-2" />
          <ChatWindow />
        </div>
      </DrawerComponent>
    </div>
  );
};
