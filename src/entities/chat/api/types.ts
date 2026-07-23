// src/entities/chat/api/types.ts

export type AttachmentMeta = {
  url: string;
  name: string;
  type: string;
  size: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  profileId: string;
};

export type ChatInfo = {
  id: string;
  title: string | null;
  imageUrl: string | null;
};

export type Chat = {
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
    attachments: AttachmentMeta[];
    createdAt: string;
    profile: {
      name: string;
      userId: string;
    };
  } | null;
  unreadCount?: number;
};

export type Message = {
  id: string;
  text: string | null;
  chatId: string;
  profileId: string;
  createdAt: string;
  attachments: AttachmentMeta[];
  profile: {
    id: string;
    name: string;
    userId: string;
    imageUrl: string | null;
    user?: { role: string };
  };
};

export type MessagesResponse = {
  messages: Message[];
  chat: {
    id: string;
    title: string | null;
    organizationId: string | null;
    organization: {
      name: string;
    } | null;
  } | null;
};
