// src/entities/chat/api/types.ts

import type { OrgRole } from "@prisma/client"

export type AttachmentMeta = {
  url: string
  name: string
  type: string
  size: number
}

export type User = {
  id: string
  email: string
  name: string
  role: string
  profileId: string
}

export type ChatInfo = {
  id: string
  title: string | null
  imageUrl: string | null
}

export type Chat = {
  id: string
  title: string | null
  imageUrl: string | null
  updatedAt: string
  creator?: {
    id: string
    name: string
    imageUrl: string | null
  }
  organizationId: string | null
  organization?: {
    id: string
    name: string
    contractStart: Date
    contractEnd: Date
  }
  _count: {
    messages: number
  }
  lastMessage?: {
    text: string | null
    attachments: AttachmentMeta[]
    createdAt: string
    profile: {
      name: string
      userId: string
    }
  } | null
  unreadCount?: number
  memberRole: OrgRole
}
export type ChatItem = Chat & { isContractActive: boolean }
export type ChatsListItem = {
  chats: Chat & { isContractActive: boolean }[]
}

export type ReplyToData = {
  id: string
  text: string | null
  senderName: string
  attachments: AttachmentMeta[]
}

export type Message = {
  id: string
  text: string | null
  chatId: string
  profileId: string
  createdAt: string
  sender: "user" | "support"
  senderName: string
  timestamp: string
  attachments: AttachmentMeta[]
  replyTo: ReplyToData | null
  profile: {                        
    id: string
    name: string
    userId: string
    imageUrl: string | null
  }
}
export type MessagesResponse = {
  messages: Message[]
  chat: {
    id: string
    title: string | null
    organizationId: string | null
    organization: {
      name: string
    } | null
  } | null
}
