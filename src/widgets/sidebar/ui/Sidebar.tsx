// src/widgets/sidebar/ui/Sidebar.tsx
'use client';

import ButtonSignOut from '@/features/auth-signout/ui/ButtonSignOut';
import { Input } from '@/shared/ui/input';
import { Search, Settings, MessagesSquare } from 'lucide-react';
import ChatList from './ChatList';

import { authClient } from '@/app/lib/auth-client';
import { useGetChats } from '../api/useGetChats';
import { useState } from 'react';
import { CreateTopicDialog } from '@/features/create-topic';

export default function Sidebar() {
  const { data: session } = authClient.useSession();
  const { data: chats = [], isLoading } = useGetChats();
  const [search, setSearch] = useState("");

  // Фильтрация по поиску
  const filteredChats = chats.filter((chat) =>
    chat.title?.toLowerCase().includes(search.toLowerCase())
  );


  const isSupport = session?.user?.role === "support";
  const currentUserId = session?.user?.id || "";

  return (
    <div className="flex h-full">
     <div className="flex flex-col h-full bg-background border-r border-border select-none justify-between py-4 px-1">
      <div className='grid gap-1 justify-items-center'>
          <MessagesSquare />
          <span className="text-xs">Чаты</span>
        </div>
        <div className='grid gap-1 justify-items-center'>
          <Settings />
          <span className="text-xs">Настройки</span>
        </div>
     </div>
     <div className="flex flex-col h-full bg-background border-r border-border select-none">
      <div className="p-4 border-b border-border bg-muted/10">
        <h2 className="font-bold text-lg tracking-tight">Поддержка</h2>
        
        {/* Поисковая строка в стиле Telegram */}
        <div className="relative mt-3 flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input 
            type="text" 
            placeholder="Поиск диалогов..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 rounded-xl h-9 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <CreateTopicDialog />
      </div>

      {/* Список открытых тикетов */}
      <div className="flex-1 py-2 flex flex-col min-h-0">
        {isLoading ? (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground animate-pulse">
            Загрузка чатов...
          </div>
        ) : (
          <ChatList 
            chats={filteredChats} 
            isSupport={isSupport} 
            currentUserId={currentUserId} 
          />
        )}
      </div>
        {/* <div className='grid gap-1 justify-items-center'>
          <Settings />
          <span>Настройки</span>
        </div> */}
      {/* Нижняя панель с кнопкой выхода по FSD */}
      {/* <div className="p-3 border-t border-border">
        <ButtonSignOut />
      </div> */}
     </div>
    </div>
  );
}