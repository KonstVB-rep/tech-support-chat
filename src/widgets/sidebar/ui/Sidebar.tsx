// src/widgets/sidebar/ui/Sidebar.tsx
"use client";

import { Input } from "@/shared/ui/input";
import { Search } from "lucide-react";
import SidebarContent from "./SidebarTypes/SidebarContent";

import { authClient } from "@/app/lib/auth-client";
import { CreateTopicDialog } from "@/features/create-topic";
import { SIDEBAR_TYPES, SidebarTypes } from "@/widgets/types";
import { useState } from "react";
import { useGetChats } from "../api/useGetChats";

type SidebarProps = {
  sidebarType: SidebarTypes;
};

const Sidebar = ({ sidebarType }: SidebarProps) => {
  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col h-full bg-primary-foreground border-r border-border select-none">
        {sidebarType === SIDEBAR_TYPES.CHATS && <SideBarChats />}
      </div>
    </div>
  );
};

export default Sidebar;

const SideBarChats = () => {
  const { data: session } = authClient.useSession();
  const [search, setSearch] = useState("");
  const { data: chats = [], isLoading } = useGetChats();

  const filteredChats = chats.filter((chat) =>
    chat.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="p-4">
        <h2 className="font-bold text-lg tracking-tight flex gap-2 items-center justify-between">
          <span className="uppercase">Чаты</span>
          {(session?.user?.role === "support" ||
            session?.user?.role === "admin") && <CreateTopicDialog />}
        </h2>

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
        {!chats.length && isLoading ? (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground animate-pulse">
            Загрузка чатов...
          </div>
        ) : (
          <SidebarContent.Chats chats={filteredChats} />
        )}
      </div>
    </>
  );
};
