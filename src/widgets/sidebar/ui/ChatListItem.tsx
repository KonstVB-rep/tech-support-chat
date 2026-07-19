"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/lib/utils";

interface ChatListItemProps {
  id?: string;
  userName: string;
  userImage?: string;
  lastMessage?: string;
  timestamp?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ChatListItem = ({
  userName,
  userImage,
  lastMessage = "Нет сообщений",
  timestamp = "",
  isActive = false,
  onClick,
}: ChatListItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left mb-1",
        "hover:bg-muted/60 active:scale-[0.99]",
        isActive &&
          "bg-primary text-primary-foreground hover:bg-primary shadow-sm",
      )}
    >
      {/* Аватарка пользователя */}
      <Avatar className="w-11 h-11 border border-border/20 shrink-0">
        <AvatarImage src={userImage || ""} alt={userName} />
        <AvatarFallback
          className={cn(
            "font-bold",
            isActive
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {userName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Информационный блок */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="font-medium text-sm truncate">{userName}</span>
          <span
            className={cn(
              "text-[10px] shrink-0",
              isActive ? "text-primary-foreground/60" : "text-muted-foreground",
            )}
          >
            {timestamp}
          </span>
        </div>

        {/* Превью последнего сообщения */}
        <p
          className={cn(
            "text-xs truncate mt-0.5",
            isActive ? "text-primary-foreground/80" : "text-muted-foreground",
          )}
        >
          {lastMessage}
        </p>
      </div>
    </button>
  );
};

export default ChatListItem;
