// src/entities/chat/ui/SidebarChatList.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import type { ChatItem } from "@/entities/chat/api/types"
import { useChatListActions } from "@/entities/chat/api/useChatListActions"
import ChatListItem from "@/entities/chat/ui/ChatListItem"
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent"
import { ChatWindow } from "@/widgets/chat-window"

type ChatListProps = {
  chats: ChatItem[]
}

export const SidebarChatList = ({ chats }: ChatListProps) => {
  const searchParams = useSearchParams()

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false)
  const { activeTicketId, handlePrefetch, handleChatSelect } = useChatListActions()

  const onSelect = useCallback(
    (chat: ChatItem) => {
      handleChatSelect(chat)
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsMobileChatOpen(true)
      }
    },
    [handleChatSelect],
  )

  useEffect(() => {
    const chatFromUrl = searchParams.get("chat")
    if (chatFromUrl && chatFromUrl !== activeTicketId) {
    } else if (!chatFromUrl && !activeTicketId) {
      setIsMobileChatOpen(false)
    }
  }, [searchParams, activeTicketId])

  if (chats.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <div className="mb-2 text-3xl">💬</div>
        <p className="text-muted-foreground text-xs">Нет диалогов</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 select-none flex-col gap-1.5 overflow-y-auto px-3">
      {chats.map((chat) => (
        <ChatListItem
          chat={chat}
          isActive={chat.id === activeTicketId}
          key={chat.id}
          onPrefetch={() => handlePrefetch(chat.id)}
          onSelect={() => onSelect(chat)}
        />
      ))}

      <DrawerComponent
        className="h-full w-full max-w-full data-[vaul-drawer-direction=left]:h-[100dvh] data-[vaul-drawer-direction=left]:max-h-[100vh] data-[vaul-drawer-direction=left]:w-full data-[vaul-drawer-direction=left]:sm:max-w-full data-[vaul-drawer-direction=right]:sm:max-w-full md:hidden"
        onOpenChange={setIsMobileChatOpen}
        open={isMobileChatOpen}
        side="left"
      >
        <div className="relative flex h-full flex-col gap-3 md:px-4">
          <div className="-translate-y-1/2 absolute top-1/2 right-0 h-3/12 w-2 rounded-s-md bg-chart-2" />
          <ChatWindow />
        </div>
      </DrawerComponent>
    </div>
  )
}
