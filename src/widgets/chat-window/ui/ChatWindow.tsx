'use client';
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { MessageItem } from '@/entities/message';
import { MessageInput } from '@/features/send-message';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Button } from '@/shared/ui/button';

export default function ChatWindow() {
  const { messages, initChat, sendMessage, clearChat } = useChatStore();
  
  // Реф для управления прокруткой внутри ScrollArea от Shadcn
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChat();
  }, [initChat]);

  // Автоматический плавный скролл вниз при получении новых сообщений
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen mx-auto bg-background border-x border-border shadow-xl">
      {/* Шапка чата с использованием компонентов Shadcn */}
      <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground shadow-md">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-primary-foreground/20">
            <AvatarImage src="" alt="Поддержка" />
            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground font-bold">
              ТП
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-sm">Техническая поддержка</h2>
            <span className="text-xs text-primary-foreground/70 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Оператор онлайн
            </span>
          </div>
        </div>
        
        {/* Кнопка сброса чата из Shadcn */}
        <Button 
          variant="secondary" 
          size="sm"
          onClick={clearChat}
          className="text-xs h-7 px-2.5"
        >
          Сброс
        </Button>
      </div>

      {/* Список сообщений через ScrollArea от Shadcn */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-muted/30">
        <div className="pr-3">
          {messages.map((msg) => (
            <MessageItem 
              key={msg.id} 
              text={msg.text} 
              sender={msg.sender} 
              timestamp={msg.timestamp} 
            />
          ))}
        </div>
      </ScrollArea>

      {/* Поле ввода (Фича отправки) */}
      <MessageInput onSendMessage={(text: string) => sendMessage(text, 'user')} />
    </div>
  );
}
