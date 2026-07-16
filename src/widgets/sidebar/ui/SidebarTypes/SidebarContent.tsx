// src/widgets/sidebar/ui/ChatList.tsx
"use client";

import { FC } from "react";
import type { Chat } from "../../api/useGetChats";
import { SidebarChatList } from "./SidebarContentByType/SidebarChatList";
// import { SidebarSettingsList } from "./SidebarContentByType/SidebarSettingsList";


interface SidebarContentComponent extends FC {
  // Settings: FC;
  Chats: FC<ChatListProps>;
}

const SidebarContent: SidebarContentComponent = () => null;


interface ChatListProps {
  chats: Chat[];
}


// SidebarContent.Settings = SidebarSettingsList;
SidebarContent.Chats = SidebarChatList;

export default SidebarContent