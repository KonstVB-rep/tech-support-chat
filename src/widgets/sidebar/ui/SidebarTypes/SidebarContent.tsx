// src/widgets/sidebar/ui/ChatList.tsx
"use client"

import type { FC } from "react"
import type { ChatItem } from "@/entities/chat/api/types"
import { SidebarChatList } from "./SidebarContentByType/SidebarChatList"

interface SidebarContentComponent extends FC {
  Chats: FC<ChatListProps>
}

const SidebarContent: SidebarContentComponent = () => null

interface ChatListProps {
  chats: ChatItem[]
}

SidebarContent.Chats = SidebarChatList

export default SidebarContent
