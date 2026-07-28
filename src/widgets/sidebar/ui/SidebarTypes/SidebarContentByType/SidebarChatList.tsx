// src/entities/chat/ui/SidebarChatList.tsx
"use client";

import type { ChatItem } from "@/entities/chat/api/types";
import { useChatListActions } from "@/entities/chat/api/useChatListActions";
import ChatListItem from "@/entities/chat/ui/ChatListItem";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import {
  useCurrentOrganizationId,
  useSetCurrentOrganization,
} from "@/store/useChatStore";
import { ChatWindow } from "@/widgets/chat-window";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

type ChatListProps = {
  chats: ChatItem[];
};

export const SidebarChatList = ({ chats }: ChatListProps) => {
  const searchParams = useSearchParams();
  const setCurrentOrganization = useSetCurrentOrganization();
  const currentOrganizationId = useCurrentOrganizationId();

  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const { activeTicketId, handlePrefetch, handleChatSelect } =
    useChatListActions();

  const onSelect = useCallback(
    (chat: ChatItem) => {
      handleChatSelect(chat);
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsMobileChatOpen(true);
      }
    },
    [handleChatSelect],
  );

  useEffect(() => {
    if (currentOrganizationId) return;
    const firstOrgChat = chats.find((c) => c.organization && c.memberRole);
    if (firstOrgChat?.organization) {
      setCurrentOrganization(
        firstOrgChat.organization.id,
        firstOrgChat.memberRole,
      );
    }
  }, [chats, currentOrganizationId, setCurrentOrganization]);

  useEffect(() => {
    const chatFromUrl = searchParams.get("chat");
    if (chatFromUrl && chatFromUrl !== activeTicketId) {
    } else if (!chatFromUrl && !activeTicketId) {
      setIsMobileChatOpen(false);
    }
  }, [searchParams, activeTicketId]);

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
        <div className="text-3xl mb-2">💬</div>
        <p className="text-xs text-muted-foreground">Нет диалогов</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 select-none flex flex-col gap-1.5">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeTicketId}
          onSelect={() => onSelect(chat)}
          onPrefetch={() => handlePrefetch(chat.id)}
        />
      ))}

      <DrawerComponent
        open={isMobileChatOpen}
        onOpenChange={setIsMobileChatOpen}
        className="data-[vaul-drawer-direction=left]:sm:max-w-full data-[vaul-drawer-direction=right]:sm:max-w-full data-[vaul-drawer-direction=left]:max-h-[100vh] data-[vaul-drawer-direction=left]:h-[100dvh] md:hidden w-full max-w-full data-[vaul-drawer-direction=left]:w-full h-full"
        side="left"
      >
        <div className="md:px-4 flex flex-col gap-3 relative h-full">
          <div className="absolute right-0 h-3/12 bg-chart-2 rounded-s-md top-1/2 -translate-y-1/2 w-2" />
          <ChatWindow />
        </div>
      </DrawerComponent>
    </div>
  );
};
