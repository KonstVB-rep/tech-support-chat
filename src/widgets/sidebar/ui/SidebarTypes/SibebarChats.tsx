import { Input } from '@/shared/ui/input';
import { Search, } from 'lucide-react';
import SidebarContent from './SidebarContent';

import { authClient } from '@/app/lib/auth-client';
import { CreateTopicDialog } from '@/features/create-topic';

import { useState } from 'react';
import { useGetChats } from '../../api/useGetChats';


export const SideBarChats = () => {
  const { data: session } = authClient.useSession();
  const [search, setSearch] = useState("");
  const { data: chats = [], isLoading } = useGetChats();

  const filteredChats = chats.filter((chat) =>
    chat.title?.toLowerCase().includes(search.toLowerCase())
  );


  const isSupport = session?.user?.role === "support";
  const currentUserId = session?.user?.id || "";

  return (
     <>
      <div className="p-4 border-b border-border bg-muted/10">
        <h2 className="font-bold text-lg tracking-tight flex gap-2 items-center justify-between"><span className="uppercase">Чаты</span><CreateTopicDialog /></h2>
        

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
      </div>

      <div className="flex-1 py-2 flex flex-col min-h-0">
        {isLoading ? (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground animate-pulse">
            Загрузка чатов...
          </div>
        ) : (
          <SidebarContent.Chats
            chats={filteredChats} 
            isSupport={isSupport} 
            currentUserId={currentUserId} 
          />
        )}
      </div>
     </>
  )
}

