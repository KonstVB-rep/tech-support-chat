// src/entities/chat/ui/ChatListItem.tsx
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import type { ChatItem } from "@/entities/chat/api/types";
import { useMyProfile } from "@/entities/profile/api";

type ChatListItemProps = {
  chat: ChatItem;
  isActive: boolean;
  onSelect: () => void;
  onPrefetch: () => void;
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (days === 1) return "Вчера";
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
};

const LinkPath = {
  user: "/user-organizations",
  admin: (id: string) => `/admin/organizations/${id}`,
};

const ChatListItem = ({
  chat,
  isActive,
  onSelect,
  onPrefetch,
}: ChatListItemProps) => {
  const displayTitle =
    chat.title || chat.organization?.name || "Обращение в поддержку";

  const { data: profile } = useMyProfile();

  const lastMsg = chat.lastMessage ?? null;
  const attachments = lastMsg?.attachments ?? [];

  const firstImage = attachments.find((a) => a.type.startsWith("image"));
  const firstVideo = attachments.find((a) => a.type.startsWith("video"));
  const firstDoc = attachments.find(
    (a) => !a.type.startsWith("image") && !a.type.startsWith("video"),
  );

  console.log(profile, "profile");

  return (
    <div className="relative">
      {!chat.isContractActive && (
        <Link
          href={
            profile?.user?.role === "admin"
              ? LinkPath.admin(chat?.organization?.id || "")
              : LinkPath.user
          }
          title="Подробнее"
          className="text-xs z-10 absolute bottom-[2px] right-[2px] p-1 border border-primary rounded-md bg-red-800 text-white"
        >
          Договор не активен
        </Link>
      )}

      <Button
        data-chat-id={chat.id}
        onClick={onSelect}
        onMouseEnter={onPrefetch}
        className={cn(
          "w-full relative items-center gap-3 px-3 py-2.5 hover:bg-muted/50 bg-transparent transition-colors text-left h-auto rounded-md flex",
          isActive && "md:bg-primary/10 md:hover:bg-primary/15",
        )}
      >
        <Avatar className="w-11 h-11 border border-border/50 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
            {displayTitle.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-semibold text-sm truncate text-primary">
              {displayTitle}
            </h3>
            <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
              {lastMsg
                ? formatTime(lastMsg.createdAt)
                : formatTime(chat.updatedAt)}
            </span>
          </div>

          <div className="flex items-end justify-between gap-2 mt-1">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {firstImage && (
                <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-border/30">
                  <Image
                    src={firstImage.url}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="32px"
                  />
                </div>
              )}

              {!firstImage && firstVideo && (
                <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-border/30 bg-black/5 flex items-center justify-center">
                  <span className="text-xs">🎥</span>
                </div>
              )}

              {!firstImage && !firstVideo && firstDoc && (
                <div className="w-8 h-8 rounded flex-shrink-0 border border-border/30 bg-muted/50 flex items-center justify-center">
                  <span className="text-xs">📎</span>
                </div>
              )}

              <p className="text-xs text-muted-foreground line-clamp-1 leading-tight min-w-0">
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

            {(chat.unreadCount ?? 0) > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center leading-none flex-shrink-0">
                {chat.unreadCount! > 99 ? "99+" : chat.unreadCount}
              </span>
            )}
          </div>
        </div>
      </Button>
    </div>
  );
};

export default ChatListItem;
