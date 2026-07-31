// src/widgets/chat-window/ui/ChatWindow.tsx
"use client"

import { authClient } from "@/app/lib/auth-client"
import type { AttachmentMeta, Chat, Message, MessagesResponse } from "@/entities/chat/api/types"
import { useGetCurrentMemberRole } from "@/entities/employee/api/useGetCurrentMemberRole"
import { MessageItem } from "@/entities/message"
import { useUpdateChatTitle } from "@/features/manage-chat-members"
import { MessageInput } from "@/features/send-message"
import { USER_ROLE } from "@/shared/constants"
import { useSocketStatus } from "@/shared/lib/hooks/useSocketStatus"
import { ProtectByRole } from "@/shared/lib/ProtectByRole"
import { getSocket } from "@/shared/lib/socket"
import { useNotificationSound } from "@/shared/lib/useNotificationSound"
import { Button } from "@/shared/ui/components/button"
import { Input } from "@/shared/ui/components/input"
import { ScrollArea } from "@/shared/ui/components/scroll-area"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"
import WrapperScreen from "@/shared/ui/custom/WrapperScreen"
import { useActiveTicketId, useClearChat } from "@/store/useChatStore"
import { ChatHeaderActions } from "@/widgets/chat-window/ui/ChatHeaderActions"
import DropdownChatActions from "@/widgets/chat-window/ui/DropdownChatActions"
import { useGetChatById } from "@/widgets/sidebar/api/useGetChatById"
import { useQueryClient } from "@tanstack/react-query"
import { ChevronDown, ChevronLeft, Pencil, PenOff, Save } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { useGetMessages } from "../api/useGetMessages"

export const ChatWindow = () => {
  const clearChat = useClearChat()
  const queryClient = useQueryClient()
  const activeTicketId = useActiveTicketId()
  const { play } = useNotificationSound()

  const { data: session } = authClient.useSession()
  const { data: chat } = useGetChatById({ chatId: activeTicketId })
  const { data: messagesData, isLoading, error } = useGetMessages(activeTicketId)
  const { mutate: renameChat, isPending: isRenaming } = useUpdateChatTitle()
  const socketStatus = useSocketStatus()

  const [prevId, setPrevId] = useState(activeTicketId)
  const [newTitle, setNewTitle] = useState("")
  const [isEditing, setIsEditMode] = useState(false)
  const [showScrollDown, setShowScrollDown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const prevTicketIdRef = useRef<string | null>(null)
  const hasScrolledRef = useRef(false)
  const scrollViewportRef = useRef<HTMLDivElement | null>(null)
  const isAtBottomRef = useRef(true)

  if (activeTicketId !== prevId) {
    setPrevId(activeTicketId)
    setIsEditMode(false)
  }

  const serverMessages = messagesData?.messages || []
  const chatInfo = messagesData?.chat || null
  const chatDisplayTitle = chatInfo?.title || "Загрузка чата..."

  const setScrollContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !activeTicketId) return

      const viewport = node.querySelector(
        "[data-radix-scroll-area-viewport]",
      ) as HTMLDivElement | null
      if (!viewport) return

      // Cleanup предыдущего listener
      const prevCleanup = (node as any).__scrollCleanup
      if (prevCleanup) prevCleanup()

      scrollViewportRef.current = viewport

      // Сброс при смене чата
      if (prevTicketIdRef.current !== activeTicketId) {
        prevTicketIdRef.current = activeTicketId
        hasScrolledRef.current = false
        setUnreadCount(0)
        isAtBottomRef.current = true
        setShowScrollDown(false)
      }

      // Автоскролл при первой загрузке / смене чата
      if (!hasScrolledRef.current && !isLoading && serverMessages.length > 0) {
        requestAnimationFrame(() => {
          viewport.scrollTo({ top: viewport.scrollHeight, behavior: "auto" })
          hasScrolledRef.current = true
        })
      }

      // Отслеживание позиции скролла
      const handleScroll = () => {
        const threshold = 100
        const distanceFromBottom =
          viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
        const nearBottom = distanceFromBottom < threshold

        isAtBottomRef.current = nearBottom
        setShowScrollDown(!nearBottom)

        if (nearBottom) {
          setUnreadCount(0)
        }
      }

      viewport.addEventListener("scroll", handleScroll, { passive: true })
      handleScroll()

      ;(node as any).__scrollCleanup = () => {
        viewport.removeEventListener("scroll", handleScroll)
      }
    },
    [activeTicketId, isLoading, serverMessages.length],
  )

  useEffect(() => {
    if (!isEditing && chat?.title) {
      setNewTitle(chat.title)
    }
  }, [chat?.title, isEditing])

  useEffect(() => {
    const socket = getSocket()

    const handleNewMessageSound = (message: Message) => {
      const isOwnMessage = message.profile?.userId === session?.user?.id
      const isCurrentChat = message.chatId === activeTicketId
      const isPageVisible = document.visibilityState === "visible"

      if (!isOwnMessage && (!isCurrentChat || !isPageVisible)) {
        play()
      }
    }

    if (activeTicketId) {
      socket.emit("chat:join", activeTicketId)
      fetch(`/api/chats/${activeTicketId}/read`, { method: "POST" }).catch(() => {})
    }

    const handleNewMessage = (message: Message) => {
      if (message.chatId !== activeTicketId) return

      queryClient.setQueryData<MessagesResponse>(["messages", activeTicketId], (old) => {
        const messages = old?.messages || []
        if (messages.some((m) => m.id === message.id)) return old
        return { messages: [...messages, message], chat: old?.chat || null }
      })

      const isOwnMessage = message.profile?.userId === session?.user?.id

      if (isAtBottomRef.current) {
        // Пользователь внизу — автоскролл
        requestAnimationFrame(() => {
          scrollViewportRef.current?.scrollTo({
            top: scrollViewportRef.current.scrollHeight,
            behavior: "smooth",
          })
        })
      } else if (!isOwnMessage) {
        // Пользователь выше — увеличиваем счётчик непрочитанных
        setUnreadCount((prev) => prev + 1)
      }

      queryClient.setQueryData<Chat[]>(["chats"], (old) =>
        old?.map((c) =>
          c.id === activeTicketId
            ? { ...c, unreadCount: 0, lastReadAt: new Date().toISOString() }
            : c,
        ),
      )

      fetch(`/api/chats/${activeTicketId}/read`, { method: "POST" }).catch(() => {})
    }

    const handleChatRemoved = (data: { chatId: string }) => {
      if (data.chatId === activeTicketId) clearChat()
    }

    socket.on("message:new", handleNewMessageSound)
    socket.on("message:new", handleNewMessage)
    socket.on("chat:removed", handleChatRemoved)

    return () => {
      socket.off("message:new", handleNewMessageSound)
      socket.off("message:new", handleNewMessage)
      socket.off("chat:removed", handleChatRemoved)
      if (activeTicketId) socket.emit("chat:leave", activeTicketId)
    }
  }, [activeTicketId, queryClient, clearChat, session, play])

  const handleRenameSubmit = () => {
    if (newTitle === chatDisplayTitle) return
    if (!newTitle.trim() || !activeTicketId) return

    renameChat(
      { chatId: activeTicketId, newTitle: newTitle.trim() },
      { onSuccess: () => setIsEditMode(false) },
    )
  }

  const currentMemberRole = useGetCurrentMemberRole(chatInfo?.organizationId)
  const currentUserId = session?.user?.id

  if (!activeTicketId) {
    return (
      <div className="flex h-full select-none items-center justify-center bg-muted/10 px-2 text-muted-foreground text-sm">
        Выберите чат в списке слева, чтобы начать
      </div>
    )
  }

  return (
    <WrapperScreen className="chat-field">
      <WrapperHeaderScreen>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex w-full items-center gap-1">
            <Button
              onClick={() => {
                clearChat()
                window.history.replaceState(null, "", window.location.pathname)
              }}
              size="icon"
              variant="ghost"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <RenameChatField
              chatDisplayTitle={chatInfo?.title}
              handleRenameSubmit={handleRenameSubmit}
              isEditing={isEditing}
              isRenaming={isRenaming}
              newTitle={newTitle}
              setIsEditMode={setIsEditMode}
              setNewTitle={setNewTitle}
            />
          </div>

          <DropdownChatActions>
            <div className="grid gap-2">
              <ChatHeaderActions chatId={activeTicketId} currentMemberRole={currentMemberRole} />
            </div>
          </DropdownChatActions>
        </div>
      </WrapperHeaderScreen>

      <div className="relative mx-auto flex min-h-0 w-full flex-1 flex-col">
        <ScrollArea className="h-full w-full px-4" ref={setScrollContainerRef}>
          <div className="mx-auto w-full max-w-2xl p-3">
            {!messagesData && isLoading && (
              <div className="animate-pulse py-4 text-center text-muted-foreground text-xs">
                Загрузка переписки...
              </div>
            )}

            {error && (
              <div className="py-4 text-center text-destructive text-xs">
                Не удалось обновить историю
              </div>
            )}

            {!isLoading && !error && serverMessages.length === 0 && (
              <div className="py-4 text-center text-muted-foreground text-xs">
                В этой теме пока нет сообщений. Напишите что-нибудь!
              </div>
            )}

            {serverMessages.map((msg) => {
              const time = new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              const isMe = msg.profile?.userId === currentUserId

              return (
                <div className="relative pb-3 pl-10" key={msg.id}>
                  {!isMe && (
                    <div className="absolute bottom-0 left-0">
                      {msg.profile?.imageUrl ? (
                        <Image
                          alt={`Аватар ${msg.profile.name || ""}`}
                          className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                          height={32}
                          src={msg.profile.imageUrl}
                          width={32}
                        />
                      ) : (
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 font-bold text-primary text-xs">
                          {(msg.profile?.name || "У")[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                  )}
                  <div
                    className={`mb-0.5 block px-1 font-medium text-[10px] text-muted-foreground ${isMe ? "text-right" : "text-left"}`}
                  >
                    <span className="mb-0.5 flex items-center gap-1.5 px-1 font-medium text-[10px]">
                      {isMe ? (
                        <span className="ml-auto text-muted-foreground">Вы</span>
                      ) : (
                        <span className="truncate text-primary">
                          {msg.profile?.name || "Участник"}
                        </span>
                      )}
                    </span>
                  </div>
                  <MessageItem
                    id={msg.id}
                    attachments={(msg.attachments as AttachmentMeta[]) ?? []}
                    sender={isMe ? "user" : "support"}
                    senderName={msg.profile?.name || "Участник"}
                    text={msg.text}
                    timestamp={time}
                    replyTo={msg.replyTo ?? null}
                  />
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {/* Кнопка скролла вниз с счётчиком непрочитанных */}
        {showScrollDown && (
          <button
            type="button"
            onClick={() => {
              scrollViewportRef.current?.scrollTo({
                top: scrollViewportRef.current.scrollHeight,
                behavior: "smooth",
              })
              setUnreadCount(0)
            }}
            className="absolute bottom-4 right-6 z-10 flex items-center gap-1 rounded-full border border-border bg-background shadow-lg text-foreground transition-all hover:bg-muted animate-in fade-in slide-in-from-bottom-2 duration-200"
            title="К последнему сообщению"
          >
            <div className="flex size-10 items-center justify-center">
              <ChevronDown className="size-5" />
            </div>
            {unreadCount > 0 && (
              <span className="mr-2 flex min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 py-0.5 font-medium text-[10px] text-primary-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {socketStatus !== "connected" && (
        <div className="w-full animate-pulse border-amber-500/20 border-t bg-amber-500/10 py-1.5 text-center font-medium text-amber-600 text-xs dark:text-amber-400">
          {socketStatus === "connecting"
            ? "⚠️ Соединение с сервером потеряно. Переподключение..."
            : "❌ Нет связи с сервером поддержки"}
        </div>
      )}
      <div className="w-full shrink-0">
        {chat && !chat?.isContractActive ? (
          <div className="rounded-md bg-muted p-4 text-center text-muted-foreground text-sm">
            Договор не активен. Отправка сообщений недоступна.
          </div>
        ) : (
          <MessageInput overrideTicketId={activeTicketId} />
        )}
      </div>
    </WrapperScreen>
  )
}

const RenameChatField = ({
  isEditing,
  isRenaming,
  chatDisplayTitle,
  setIsEditMode,
  newTitle,
  setNewTitle,
  handleRenameSubmit,
}: {
  isEditing: boolean
  chatDisplayTitle: string | null | undefined
  isRenaming: boolean
  setIsEditMode: (isEditing: boolean) => void
  newTitle: string
  setNewTitle: (newTitle: string) => void
  handleRenameSubmit: () => void
}) => {
  return (
    <ProtectByRole requiredRole={USER_ROLE.ADMIN}>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <Input
            className="h-10 rounded-lg text-lg md:text-lg"
            disabled={isRenaming}
            onChange={(e) => setNewTitle(e.target.value)}
            value={newTitle}
          />
        ) : (
          <h2 className="font-semibold text-primary text-sm">{chatDisplayTitle?.toUpperCase()}</h2>
        )}
        {isEditing && (
          <Button
            className="h-10 w-10"
            disabled={isRenaming}
            onClick={handleRenameSubmit}
            size="icon"
            title="Сохранить"
            variant="outline"
          >
            <Save className="size-4" />
          </Button>
        )}
        {chatDisplayTitle && (
          <ProtectByRole requiredRole={USER_ROLE.ADMIN}>
            <Button
              className="flex h-10 w-10 items-center justify-center gap-2 rounded-md text-primary hover:bg-primary/30 focus-visible:bg-primary/30"
              onClick={() => setIsEditMode(!isEditing)}
              size="icon"
              title="Переименовать"
              variant="ghost"
            >
              {!isEditing ? <Pencil className="size-5" /> : <PenOff className="size-5" />}
            </Button>
          </ProtectByRole>
        )}
      </div>
    </ProtectByRole>
  )
}