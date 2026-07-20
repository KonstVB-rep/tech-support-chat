// src/widgets/chat-window/ui/ChatWindow.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/app/lib/auth-client";
import { MessageInput } from "@/features/send-message";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import WrapperScreen from "@/shared/ui/custom/WrapperScreen";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { useActiveTicketId, useClearChat } from "@/store/useChatStore";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useGetMessages } from "../api/useGetMessages";
import { USER_ROLE } from "@/shared/constants";
import { ProtectByRole } from "@/shared/lib/ProtectByRole";
import {
  ChatMembersSheet,
  useDeleteChat,
  useUpdateChatTitle,
} from "@/features/manage-chat-members";
import { OrgRole } from "@prisma/client";
import { useGetCurrentMemberRole } from "@/entities/employee/api/useGetCurrentMemberRole";
import { getSocket } from "@/shared/lib/socket";
import type { MessagesResponse, Message, Chat } from "@/entities/chat/api/types";
import { useSocketStatus } from "@/shared/lib/hooks/useSocketStatus";
import { MessageItem } from "@/entities/message";

export const ChatWindow = () => {
  const clearChat = useClearChat();
  const queryClient = useQueryClient();
  const activeTicketId = useActiveTicketId();

  const { data: session } = authClient.useSession();
  const {
    data: messagesData,
    isLoading,
    error,
  } = useGetMessages(activeTicketId);

  const { mutate: renameChat, isPending: isRenaming } = useUpdateChatTitle();
  const { mutate: deleteChat, isPending: isDeleting } = useDeleteChat();
  const socketStatus = useSocketStatus();

  const [prevId, setPrevId] = useState(activeTicketId);
  const [newTitle, setNewTitle] = useState("");
  const [isEditing, setIsEditMode] = useState(false);

  if (activeTicketId !== prevId) {
    setPrevId(activeTicketId);
    setIsEditMode(false);
    setNewTitle("");
  }

  const serverMessages = messagesData?.messages || [];
  const chatInfo = messagesData?.chat || null;
  const chatDisplayTitle = chatInfo?.title || "Загрузка чата...";

  const setScrollContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    const viewport = node.querySelector("[data-radix-scroll-area-viewport]");
    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!activeTicketId) return;

    const socket = getSocket();
    socket.emit("chat:join", activeTicketId);

    const handleNewMessage = (message: Message) => {
      if (message.chatId !== activeTicketId) return;

      queryClient.setQueryData<MessagesResponse>(
        ["messages", activeTicketId],
        (old) => {
          const messages = old?.messages || [];
          if (messages.some((m) => m.id === message.id)) {
            return old;
          }
          return {
            messages: [...messages, message],
            chat: old?.chat || null,
          };
        },
      );
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.emit("chat:leave", activeTicketId);
    };
  }, [activeTicketId, queryClient]);

  useEffect(() => {
    if (!activeTicketId) return;

     fetch(`/api/chats/${activeTicketId}/read`, { method: "POST" })
      .then(() => {
        queryClient.setQueryData<Chat[]>(["chats"], (old) => {
          if (!old) return old;
          return old.map((chat) =>
            chat.id === activeTicketId
              ? { ...chat, unreadCount: 0, lastReadAt: new Date().toISOString() }
              : chat,
          );
        });
      })
      .catch(() => {});

    const socket = getSocket();

    const handleChatRemoved = (data: { chatId: string }) => {
      if (data.chatId === activeTicketId) {
        clearChat();
      }
    };

    socket.on("chat:removed", handleChatRemoved);

    return () => {
      socket.off("chat:removed", handleChatRemoved);
    };
  }, [activeTicketId, clearChat, queryClient]);

  const handleRenameSubmit = () => {
    if (newTitle === chatDisplayTitle) return;
    if (!newTitle.trim() || !activeTicketId) return;

    renameChat(
      { chatId: activeTicketId, newTitle: newTitle.trim() },
      { onSuccess: () => setIsEditMode(false) },
    );
  };

  const handleDeleteChat = () => {
    if (!activeTicketId) return;
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите НАВСЕГДА удалить эту тему и всю историю переписки?",
    );
    if (!confirmDelete) return;

    deleteChat(activeTicketId, { onSuccess: () => clearChat() });
  };

  const currentMemberRole = useGetCurrentMemberRole(chatInfo?.organizationId);
  const currentUserId = session?.user?.id;

  if (!activeTicketId) {
    return (
      <div className="px-2 flex items-center justify-center h-full bg-muted/10 text-muted-foreground text-sm select-none">
        Выберите объект или проект в списке слева, чтобы начать работу
      </div>
    );
  }

  return (
    <WrapperScreen className="chat-field">
      <WrapperHeaderScreen>
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-1">
            <Button size="icon" onClick={() => {
                          clearChat(); 
                          window.history.replaceState(null, "", window.location.pathname); 
                        }} variant="ghost">
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {isEditing ? (
              <div className="flex items-center gap-1">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-7 text-xs rounded-lg"
                  disabled={isRenaming}
                />
                <Button
                  size="sm"
                  onClick={handleRenameSubmit}
                  disabled={isRenaming}
                >
                  ОК
                </Button>
              </div>
            ) : (
              <h2 className="font-semibold text-sm text-primary">
                {chatDisplayTitle?.toUpperCase()}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 mr-1">
            <ProtectByRole
              requiredRole="user"
              requiredOrgRole={OrgRole.RESPONSIBLE}
              currentMemberRole={currentMemberRole}
            >
              <ChatMembersSheet chatId={activeTicketId} />
            </ProtectByRole>

            <ProtectByRole requiredRole={USER_ROLE.ADMIN}>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  className="rounded-xl size-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                  onClick={handleDeleteChat}
                  title="Уничтожить чат"
                >
                  <Trash2 className="size-5" />
                </Button>
              )}
            </ProtectByRole>

            <ProtectByRole requiredRole={USER_ROLE.ADMIN}>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground rounded-xl transition-colors px-3.5"
                  onClick={() => {
                    setNewTitle(chatDisplayTitle);
                    setIsEditMode(true);
                  }}
                >
                  Переименовать
                </Button>
              )}
            </ProtectByRole>
          </div>
        </div>
      </WrapperHeaderScreen>

      {/* ✅ Callback ref вместо useRef + useEffect */}
      <div className="flex flex-col flex-1 min-h-0 w-full mx-auto">
        <ScrollArea ref={setScrollContainerRef} className="px-4 w-full h-full">
          <div className="w-full max-w-2xl mx-auto px-3 backdrop-blur-[1px]">
            {!messagesData && isLoading && (
              <div className="text-center text-xs text-muted-foreground py-4 animate-pulse">
                Загрузка переписки...
              </div>
            )}

            {error && (
              <div className="text-center text-xs text-destructive py-4">
                Не удалось обновить историю
              </div>
            )}

            {!isLoading && !error && serverMessages.length === 0 && (
              <div className="text-center text-xs text-muted-foreground py-4">
                В этой теме пока нет сообщений. Напишите что-нибудь!
              </div>
            )}

            {serverMessages.map((msg) => {
              const time = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const isMe = msg.profile?.userId === currentUserId;

              return (
                <div key={msg.id} className="pb-3">
                  <span
                    className={`text-[10px] text-muted-foreground block mb-0.5 px-1 font-medium ${isMe ? "text-right" : "text-left"}`}
                  >
                    {isMe ? "Вы" : msg.profile?.name || "Участник"}
                  </span>
                  <MessageItem
                    text={msg.text}
                    sender={isMe ? "user" : "support"}
                    timestamp={time}
                    fileUrl={msg.fileUrl}
                    fileType={msg.fileType}
                    fileName={msg.fileName}
                  />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {socketStatus !== "connected" && (
        <div className="w-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-center py-1.5 text-xs font-medium animate-pulse border-t border-amber-500/20">
          {socketStatus === "connecting"
            ? "⚠️ Соединение с сервером потеряно. Переподключение..."
            : "❌ Нет связи с сервером поддержки"}
        </div>
      )}
      <div className="shrink-0 w-full">
       <MessageInput overrideTicketId={activeTicketId} />
      </div>
    </WrapperScreen>
  );
};
export default ChatWindow;
