// src/widgets/sidebar/ui/ChatList.tsx
"use client";

import { FC } from "react";
import { SidebarChatList } from "./SidebarContentByType/SidebarChatList";
import { Chat } from "@/entities/chat/api/types";

interface SidebarContentComponent extends FC {
  Chats: FC<ChatListProps>;
}

const SidebarContent: SidebarContentComponent = () => null;

interface ChatListProps {
  chats: Chat[];
}

SidebarContent.Chats = SidebarChatList;

export default SidebarContent;
