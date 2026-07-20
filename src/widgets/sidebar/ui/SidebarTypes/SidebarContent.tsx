// src/widgets/sidebar/ui/ChatList.tsx
"use client";

import { FC } from "react";
import type { Chat } from "../../api/useGetChats";
import { SidebarChatList } from "./SidebarContentByType/SidebarChatList";

interface SidebarContentComponent extends FC {
  Chats: FC<ChatListProps>;
}

const SidebarContent: SidebarContentComponent = () => null;

interface ChatListProps {
  chats: Chat[];
}

SidebarContent.Chats = SidebarChatList;

export default SidebarContent;
