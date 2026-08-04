// src/entities/chat/api/fetchClient.ts
"use client"

import type { ChatItem, MessagesResponse, User } from "./types"

export const fetchSession = async (): Promise<User> => {
  const res = await fetch("/api/auth/get-session")
  if (!res.ok) throw new Error("Не авторизован")
  const data = await res.json()
  if (!data.user) throw new Error("Нет пользователя")
  return data.user
}

export const fetchChats = async (): Promise<ChatItem[]> => {
  const res = await fetch("/api/chats/get")
  if (!res.ok) throw new Error("Ошибка загрузки чатов")
  const data = await res.json()
  return data.chats
}

export const fetchActiveChat = async (): Promise<string | null> => {
  const res = await fetch("/api/chats/active")
  if (!res.ok) throw new Error("Ошибка получения чата")
  const data = await res.json()
  return data.chatId
}

export const fetchChatInfo = async (chatId: string): Promise<ChatItem> => {
  const res = await fetch(`/api/chats/${chatId}/info`)
  if (!res.ok) throw new Error("Чат не найден")
  const data = await res.json()
  return data.chat
}

export const fetchMessages = async (
  chatId: string,
  params: URLSearchParams = new URLSearchParams({ limit: "50" }), // ← Дефолт
): Promise<MessagesResponse> => {
  const res = await fetch(`/api/chats/${chatId}/messages/?${params.toString()}`)

  if (!res.ok) throw new Error("Ошибка загрузки сообщений")
  return await res.json()
}
