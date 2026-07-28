// src/entities/chat/api/fetchServer.ts
import "server-only";
import { cookies } from "next/headers";
import type { Chat, MessagesResponse } from "./types";

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const fetchChatsServer = async (): Promise<Chat[]> => {
  const cookieStore = await cookies();
  const res = await fetch(`${getBaseUrl()}/api/chats/get`, {
    headers: { cookie: cookieStore.toString() },
  });
  if (!res.ok) throw new Error("Ошибка загрузки чатов");
  const data = await res.json();
  return data.chats;
};

export const fetchMessagesServer = async (
  chatId: string,
): Promise<MessagesResponse> => {
  const cookieStore = await cookies();
  const res = await fetch(`${getBaseUrl()}/api/chats/${chatId}/messages`, {
    headers: { cookie: cookieStore.toString() },
  });

  if (!res.ok) throw new Error("Ошибка загрузки сообщений");
  return await res.json();
};
