// src/widgets/chat-window/ui/ChatWindow.tsx
"use client";
import { authClient } from "@/app/lib/auth-client"; // Клиент Better Auth
import { MessageItem } from "@/entities/message";
import { MessageInput } from "@/features/send-message";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useActiveTicketId, useActiveTicketTitle } from "@/store/useChatStore"; // Наш топ-селектор
import { useEffect, useRef } from "react";
import { useGetMessages } from "../api/useGetMessages";
import { ChevronLeft } from "lucide-react";

export const ChatWindow = () => {
  const activeTicketId = useActiveTicketId(); // В контексте кода это наш chatId объекта/проекта
  const activeTicketTitle = useActiveTicketTitle();
  
  // Достаем сессию текущего пользователя, чтобы знать его profileId
  const { data: session } = authClient.useSession();
  
  // Автоматически скачиваем сообщения из MySQL Beget через TanStack Query
  const { data: serverMessages = [], isLoading, error } = useGetMessages(activeTicketId);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Плавный скролл вниз при получении новых текстовых ответов
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: "smooth" });
      }
    }
  }, [serverMessages]);

  if (!activeTicketId) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/10 text-muted-foreground text-sm select-none">
        Выберите объект или проект в списке слева, чтобы начать работу
      </div>
    );
  }

  // Безопасно вытаскиваем ID профиля текущего залогиненного пользователя
  // (В Better Auth сессии у нас лежит связь, либо берем из вложенного объекта, если ты расширял профиль)
  const currentUserId = session?.user?.id;

  return (
    <div className="flex flex-col h-screen bg-background border-x border-border shadow-xl">
      {/* Шапка чата */}
      <div className="flex items-center bg-primary p-4 text-primary-foreground shadow-md select-none">
        <Avatar className="w-10 h-10 border border-primary-foreground/20">
          <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground font-bold">
            О
          </AvatarFallback>
        </Avatar>
        <div className="ml-3 flex items-center gap-2">
          <ChevronLeft /><h2 className="font-semibold text-sm">{activeTicketTitle}</h2>
        </div>
      </div>

      {/* Список сообщений из базы Beget */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4 w-full max-w-2xl mx-auto">
        <div className="pr-3">
          {isLoading && (
            <div className="text-center text-xs text-muted-foreground py-4 animate-pulse">Загрузка переписки...</div>
          )}
          
          {error && (
            <div className="text-center text-xs text-destructive py-4">Не удалось обновить историю</div>
          )}

          {!isLoading && serverMessages.length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-4">В этой теме пока нет сообщений. Напишите что-нибудь!</div>
          )}

          {serverMessages.map((msg) => {
            const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            
            // 🎯 ВЫЧИСЛЯЕМ СТОРОНУ ОТПРАВИТЕЛЯ БЕЗ ПОЛЯ SENDER:
            // Сверяем: если userId автора сообщения совпадает с текущим пользователем — это "user" (справа), иначе "support" (слева)
           const isMe = msg.profile?.userId === currentUserId;

           return (
              <div key={msg.id} className="mb-3">
                <span className={`text-[10px] text-muted-foreground block mb-0.5 px-1 ${isMe ? "text-right" : "text-left"}`}>
                  {msg.profile?.name}
                </span>
                <MessageItem 
                  text={msg.text} 
                  sender={isMe ? "user" : "support"} // "user" улетит направо (синее), "support" — налево (серое)
                  timestamp={time} 
                />
              </div>
            );
            })}
        </div>
      </ScrollArea>

      {/* Поле ввода */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
