import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { useActiveTicketId, useSetActiveTicketId, useSetActiveTicketTitle } from "@/store/useChatStore";
import type { Chat } from "../../../api/useGetChats";


interface ChatListProps {
  chats: Chat[];
  isSupport: boolean;
  currentUserId: string;
}

export const SidebarChatList = ({ chats, isSupport, currentUserId }: ChatListProps) => {
  const setActiveTicketId = useSetActiveTicketId();
  const setActiveTicketTitle = useSetActiveTicketTitle();
  const activeTicketId = useActiveTicketId();

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
    } else if (days === 1) {
      return "Вчера";
    } else if (days < 7) {
      return date.toLocaleDateString("ru-RU", { weekday: "short" });
    } else {
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
        <div className="text-3xl mb-2">💬</div>
        <p className="text-xs text-muted-foreground">Нет диалогов</p>
      </div>
    );
  }

  const selectChat = (chatId: string, chatTitle: string | null) => {
    if (chatId !== activeTicketId) {
      setActiveTicketId(chatId);
      setActiveTicketTitle(chatTitle);
      }
    }


  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => {
        const isActive = chat.id === activeTicketId;
        const avatarName = isSupport
          ? chat.creator?.name || chat.title || "?"
          : chat.title || "?";

        return (
          <button
            key={chat.id}
            onClick={() => selectChat(chat.id, chat.title)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left",
              isActive && "bg-primary/10 hover:bg-primary/15"
            )}
          >
            {/* Аватар */}
            <Avatar className="w-11 h-11 border border-border/50 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                {avatarName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Информация */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="font-semibold text-sm truncate">
                  {chat.title}
                </h3>
                <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                  {formatTime(chat.updatedAt)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                {isSupport && chat.creator && (
                  <p className="text-xs text-muted-foreground truncate">
                    👤 {chat.creator.name}
                  </p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {chat._count.messages} сообщ.
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
