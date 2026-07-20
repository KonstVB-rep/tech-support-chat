// src/entities/chat/api/types.ts
// ✅ НЕТ директивы "use client" — безопасен для импорта и на сервере, и на клиенте

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  profileId: string;
}

export interface ChatInfo {
  id: string;
  title: string | null;
  imageUrl: string | null;
}

export interface Chat {
  id: string;
  title: string | null;
  imageUrl: string | null;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    imageUrl: string | null;
  };
  organization?: {
    id: string;
    name: string;
  };
  _count: {
    messages: number;
  };
  lastMessage?: {
    text: string | null;
    fileUrl: string | null;
    fileType: string | null;
    createdAt: string;
    profile: {
      name: string;
      userId: string;
    };
  } | null;
  unreadCount?: number;
}

export interface Message {
  id: string;
  text: string;
  chatId: string;
  profileId: string;
  createdAt: string;
  fileUrl?: string | null;
  fileType?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  profile: {
    id: string;
    name: string;
    userId: string;
    imageUrl: string | null;
    user?: { role: string };
  };
}

export interface MessagesResponse {
  messages: Message[];
  chat: {
    id: string;
    title: string | null;
    organizationId: string | null;
    organization: {
      name: string;
    } | null;
  } | null;
}
