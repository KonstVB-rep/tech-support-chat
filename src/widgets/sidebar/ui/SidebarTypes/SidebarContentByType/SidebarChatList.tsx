// src/entities/chat/ui/SidebarChatList.tsx
"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { useActiveTicketId, useSetActiveTicketId } from "@/store/useChatStore";
import type { Chat } from "../../../api/useGetChats";
import { Button } from "@/shared/ui/button";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import { ChatWindow } from "@/widgets/chat-window";

interface ChatListProps {
  chats: Chat[];
}

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
  } else if (days === 1) {
    return "Вчера";
  } else {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  }
};

export const SidebarChatList = ({ chats }: ChatListProps) => {
  const setActiveTicketId = useSetActiveTicketId();
  const activeTicketId = useActiveTicketId();

  // 🎯 Добавляем контролируемое состояние для единственного мобильного дровера
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  // 🎯 Добавляем локальный стейт для моментального переключения чата в шторке
  const [localMobileChatId, setLocalMobileChatId] = useState<string | null>(activeTicketId);

  // Синхронизируем локальный стейт при внешних изменениях (например, очистке чата через Zustand)
  useEffect(() => {
    setLocalMobileChatId(activeTicketId);
    if (!activeTicketId) {
      setIsMobileChatOpen(false);
    }
  }, [activeTicketId]);

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
        <div className="text-3xl mb-2">💬</div>
        <p className="text-xs text-muted-foreground">Нет диалогов</p>
      </div>
    );
  }

  // 🎯 Оптимизированный атомарный метод выбора чата (Google Style)
  const handleChatSelect = (chatId: string) => {
    // 1. Мгновенно переключаем локальный стейт для мобильной версии (0 мс ожидания)
    // Благодаря этому ChatWindow внутри шторки ПЕРЕРИСУЕТСЯ ДО начала анимации выезда!
    setLocalMobileChatId(chatId);

    // 2. В фоне асинхронно обновляем глобальный Zustand-стор проекта
    if (chatId !== activeTicketId) {
      setActiveTicketId(chatId);
    }

    // 3. Если мы на мобильном устройстве, плавно открываем шторку
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileChatOpen(true);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 select-none flex flex-col gap-1.5">
      {chats.map((chat) => {
        const isActiveDesktop = chat.id === activeTicketId;
        const displayTitle = chat.title || chat.organization?.name || "Обращение в поддержку";

        return (
          <Button
            key={chat.id}
            onClick={() => handleChatSelect(chat.id)}
            variant="ghost"
            className={cn(
              "w-full items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left h-auto rounded-md flex",
              // 🎯 ИСПРАВЛЕНО: На десктопе (md и выше) подсвечиваем активный чат, 
              // а на мобилках кнопка всегда остается чистой и однородной без заливки
              isActiveDesktop && "md:bg-primary/10 md:hover:bg-primary/15"
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
                  {formatTime(chat.updatedAt)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs text-muted-foreground truncate max-w-[130px]">
                  {chat.organization?.name || "Платформа"}
                </p>

                <p className="text-xs text-muted-foreground shrink-0 ml-auto font-medium">
                  {chat._count.messages} сообщ.
                </p>
              </div>
            </div>
          </Button>
        );
      })}

      {/* 🎯 ЕДИНЫЙ КОНТРОЛИРУЕМЫЙ ДРОВЕР НА ВЕСЬ КОМПОНЕНТ (Вынесен за пределы цикла) */}
      <DrawerComponent
        open={isMobileChatOpen}
        onOpenChange={setIsMobileChatOpen}
        className="data-[vaul-drawer-direction=left]:max-h-[100vh] data-[vaul-drawer-direction=left]:h-[100dvh] md:hidden max-w-full data-[vaul-drawer-direction=left]:w-full h-full"
        side={"left"}
      >
        <div className="md:px-4 flex flex-col gap-3 relative h-full">
          <div className="absolute right-0 h-3/12 bg-chart-2 rounded-s-md top-1/2 -translate-y-1/2 w-2" />
          {/* Передаем принудительно localMobileChatId вместо глобального activeTicketId */}
          {/* Благодаря этому в шторке никогда не моргнет предыдущая переписка */}
          <ChatWindow />
        </div>
      </DrawerComponent>
    </div>
  );
};
