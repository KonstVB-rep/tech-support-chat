// src/shared/lib/updateMessagesCache.ts
import type { InfiniteData, QueryClient } from "@tanstack/react-query"
import type { Chat, Message, MessagesResponse } from "@/entities/chat/api/types"

/**
 * Добавляет сообщение в кеш useInfiniteQuery
 */
export function addMessageToCache(
  queryClient: QueryClient,
  chatId: string,
  message: Message,
): void {
  queryClient.setQueryData<InfiniteData<MessagesResponse, string | null>>(
    ["messages", chatId],
    (old) => {
      if (!old || !Array.isArray(old.pages) || old.pages.length === 0) {
        return old
      }

      const exists = old.pages.some(
        (page) => page?.messages?.some((m) => m?.id === message.id) ?? false,
      )
      if (exists) return old

      const pages = [...old.pages]
      if (!pages[0]) return old

      pages[0] = {
        ...pages[0],
        messages: [...(pages[0].messages ?? []), message],
      }

      return { ...old, pages }
    },
  )
}

/**
 * Обновляет заголовок чата
 */
export function updateChatTitleInCache(
  queryClient: QueryClient,
  chatId: string,
  newTitle: string,
): void {
  queryClient.setQueryData<InfiniteData<MessagesResponse, string | null>>(
    ["messages", chatId],
    (old) => {
      if (!old || !Array.isArray(old.pages)) return old

      const pages = old.pages.map((p, i) =>
        i === 0 && p.chat ? { ...p, chat: { ...p.chat, title: newTitle } } : p,
      )
      return { ...old, pages }
    },
  )
}

/**
 * Сбрасывает счётчик непрочитанных
 */
export function resetUnreadCount(queryClient: QueryClient, chatId: string): void {
  queryClient.setQueryData(["chats"], (old: Chat[] | undefined) => {
    if (!old || !Array.isArray(old)) return old
    return old.map((chat) =>
      chat.id === chatId ? { ...chat, unreadCount: 0, lastReadAt: new Date().toISOString() } : chat,
    )
  })
}
