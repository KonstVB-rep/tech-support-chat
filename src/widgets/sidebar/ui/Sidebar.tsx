// src/widgets/sidebar/ui/Sidebar.tsx
'use client';

import { Input } from '@/shared/ui/input';
import { Search } from 'lucide-react';
import SidebarContent from './SidebarTypes/SidebarContent';

import { authClient } from '@/app/lib/auth-client';
import { CreateTopicDialog } from '@/features/create-topic';
import { SIDEBAR_TYPES, SidebarTypes } from '@/widgets/types';
import { useState } from 'react';
import { useGetChats } from '../api/useGetChats';

type SidebarProps = {
    sidebarType: SidebarTypes,
}

const Sidebar = ({ sidebarType }: SidebarProps) => {

  return (
    <div className="flex h-full">
     {/* <div className="flex flex-col gap-2 h-full select-none justify-start py-4 px-1 border-none bg-transparent">
       <Button    
        variant="ghost" 
        className="flex flex-col gap-1 items-center justify-center h-auto p-2 hover:bg-muted/50 rounded-xl">
          <MessagesSquare className="size-5"/>
          <span className="text-xs">Чаты</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex h-auto flex-col cursor-pointer p-1 gap-1.5 items-center justify-center bg-transparent border-none shrink-0 hover:bg-muted/40 rounded-xl"
        >
          <Settings className="size-5 text-sidebar-foreground shrink-0" />
          
          <span className="text-[10px] font-medium text-sidebar-foreground tracking-tight block">
            Настройки
          </span>
        </Button>
     </div> */}
     <div className="flex flex-1 flex-col h-full bg-background border-l border-r border-border select-none">
         {sidebarType === SIDEBAR_TYPES.CHATS && <SideBarChats />}
         {sidebarType === SIDEBAR_TYPES.SETTINGS && <SideBarSettings />}
     </div>
     {/* <div className="flex flex-1 flex-col h-full bg-background border-l border-r border-border select-none">
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
          <>
          <ChatList 
            chats={filteredChats} 
            isSupport={isSupport} 
            currentUserId={currentUserId} 
          />


          </>
        )}
      </div>
     </div> */}
    </div>
  );
}

export default Sidebar;

const SideBarChats = () => {
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

const SideBarSettings = () => {
  return (
      <div className="p-4 border-b border-border bg-muted/10">
          <h2 className="font-bold text-lg tracking-tight flex gap-2 items-center justify-between"><span className="uppercase">настройки</span></h2>
              
          <SidebarContent.Settings />

      </div>
  )
}