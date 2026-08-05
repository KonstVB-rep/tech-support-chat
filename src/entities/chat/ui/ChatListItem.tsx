// src/entities/chat/ui/ChatListItem.tsx

import { OrgRole } from "@prisma/client"
import { MessageSquareOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { ChatItem } from "@/entities/chat/api/types"
import { useGetCurrentMemberRole } from "@/entities/employee/api/useGetCurrentMemberRole"
import { useMyProfile } from "@/entities/profile/api"
import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback } from "@/shared/ui/components/avatar"
import { Button } from "@/shared/ui/components/button"

type ChatListItemProps = {
  chat: ChatItem
  isActive: boolean
  onSelect: () => void
  onPrefetch: () => void
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
  if (days === 1) return "Вчера"
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })
}

const ChatListItem = ({ chat, isActive, onSelect, onPrefetch }: ChatListItemProps) => {
  const displayTitle = chat.title || chat.organization?.name || "Обращение в поддержку"

  const { data: profile } = useMyProfile()

  const roleInOrganization = useGetCurrentMemberRole(chat.organization?.id)

  const lastMsg = chat.lastMessage ?? null
  const attachments = lastMsg?.attachments ?? []

  const firstImage = attachments.find((a) => a.type.startsWith("image"))
  const firstVideo = attachments.find((a) => a.type.startsWith("video"))
  const firstDoc = attachments.find(
    (a) => !a.type.startsWith("image") && !a.type.startsWith("video"),
  )

  const hasUnreadMessages = !!(chat.isContractActive && chat.unreadCount && chat.unreadCount > 0)
  const badgeText = chat.unreadCount && chat.unreadCount > 99 ? "99+" : chat.unreadCount

  const isHasPermission =
    profile?.user.role === "admin" || roleInOrganization === OrgRole.RESPONSIBLE

  return (
    <div className="relative rounded-lg">
      {!chat.isContractActive &&
        (isHasPermission ? (
          <Link
            className="absolute right-2 bottom-1 z-10 rounded-full p-2 text-white text-xs"
            href={`/organization/${chat?.organization?.id}`}
            title="Договор не активен.Подробнее"
          >
            <MessageSquareOff className="font-semibold text-red-600" />
          </Link>
        ) : (
          <div
            className="absolute right-2 bottom-1 z-10 rounded-full p-2 text-white text-xs"
            title="Договор не активен.Подробнее"
          >
            <MessageSquareOff className="font-semibold text-red-600" />
          </div>
        ))}

      <Button
        className={cn(
          "relative flex h-auto w-full items-center gap-3 rounded-md bg-transparent px-3 py-2.5 text-left transition-colors hover:bg-primary/15",
          isActive && "md:bg-primary/10 md:hover:bg-primary/15",
          !chat.isContractActive && "border-1 border-primary/15 border-dashed opacity-50",
        )}
        data-chat-id={chat.id}
        onClick={onSelect}
        onMouseEnter={onPrefetch}
      >
        <Avatar className="h-11 w-11 flex-shrink-0 border border-border/50">
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 font-semibold text-primary-foreground">
            {displayTitle.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center justify-between">
            <h3 className="truncate font-semibold text-primary text-sm">{displayTitle}</h3>
            <span className="ml-2 flex-shrink-0 text-[10px] text-muted-foreground">
              {lastMsg ? formatTime(lastMsg.createdAt) : formatTime(chat.updatedAt)}
            </span>
          </div>

          <div className="mt-1 flex items-end justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              {firstImage && (
                <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded border border-border/30">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="32px"
                    src={firstImage.url}
                    unoptimized
                  />
                </div>
              )}

              {!firstImage && firstVideo && (
                <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-border/30 bg-black/5">
                  <span className="text-xs">🎥</span>
                </div>
              )}

              {!firstImage && !firstVideo && firstDoc && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-border/30 bg-muted/50">
                  <span className="text-xs">📎</span>
                </div>
              )}

              <p className="line-clamp-1 min-w-0 text-muted-foreground text-xs leading-tight">
                {lastMsg?.text ||
                  (firstImage
                    ? "Фото"
                    : firstVideo
                      ? "Видео"
                      : firstDoc
                        ? firstDoc.name
                        : "Нет сообщений")}
              </p>
            </div>

            {hasUnreadMessages && (
              <span className="flex h-[18px] min-w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-blue-600 px-1 font-bold text-[10px] text-white leading-none">
                {badgeText}
              </span>
            )}
          </div>
        </div>
      </Button>
    </div>
  )
}

export default ChatListItem
