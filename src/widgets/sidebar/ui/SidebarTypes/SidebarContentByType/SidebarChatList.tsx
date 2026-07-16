import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { useActiveTicketId, useSetActiveTicketId } from "@/store/useChatStore";
import type { Chat } from "../../../api/useGetChats";
import { Button } from "@/shared/ui/button";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import { ChatWindow } from "@/widgets/chat-window";
import { Fragment } from "react/jsx-runtime";
import { ChatInfo } from "@/entities/chat";

interface ChatListProps {
  chats: Chat[];
}

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
  } else {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  }
};

export const SidebarChatList = ({ chats }: ChatListProps) => {
  const setActiveTicketId = useSetActiveTicketId();
  const activeTicketId = useActiveTicketId();

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
        <div className="text-3xl mb-2">💬</div>
        <p className="text-xs text-muted-foreground">Нет диалогов</p>
      </div>
    );
  }

  const selectChat = (chatId: string) => {
    if (chatId !== activeTicketId) {
      setActiveTicketId(chatId);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3">
      {chats.map((chat) => {
        const isActive = chat.id === activeTicketId;
        const displayTitle =
          chat.title || chat.organization?.name || "Обращение в поддержку";

        return (
          <Fragment key={chat.id}>
            <ChatSelect
              displayTitle={displayTitle}
              isActive={isActive}
              chat={chat}
              selectChat={selectChat}
              className="hidden md:flex"
            />
            {/* <Button
              onClick={() => {
                selectChat(chat.id);
              }}
              variant="ghost"
              className={cn(
                "hidden w-full md:flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left h-auto rounded-md",
                isActive && "bg-primary/10 hover:bg-primary/15",
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
                    {chat.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                    {formatTime(chat.updatedAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-xs text-muted-foreground truncate max-w-[130px]">
                    {chat.organization?.name || "Платформа"}
                  </p>

                  <p className="text-xs text-muted-foreground shrink-0 ml-auto font-medium">
                    {chat._count.messages} сообщ.
                  </p>
                </div>
              </div>
            </Button> */}

            <DrawerComponent
              trigger={
                <div className="w-full md:hidden">
                  <ChatSelect
                    displayTitle={displayTitle}
                    isActive={isActive}
                    chat={chat}
                    selectChat={selectChat}
                    className="flex"
                  />
                </div>
              }
              className="data-[vaul-drawer-direction=bottom]:max-h-[100vh] data-[vaul-drawer-direction=bottom]:h-[100dvh] md:hidden"
              side={"bottom"}
            >
              <div className="px-4 flex flex-col gap-3">
                <ChatWindow />
              </div>
            </DrawerComponent>
          </Fragment>
        );
      })}
    </div>
  );
};

type ChatSelectProps = {
  displayTitle: string;
  isActive: boolean;
  chat: Chat;
  selectChat: (chatId: string) => void;
  className?: string;
};

const ChatSelect = ({
  displayTitle,
  isActive,
  chat,
  selectChat,
  className,
}: ChatSelectProps) => {
  return (
    <Button
      onClick={() => {
        selectChat(chat.id);
      }}
      variant="ghost"
      className={cn(
        "w-full items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left h-auto rounded-md",
        className,
        isActive && "bg-primary/10 hover:bg-primary/15",
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
            {chat.title}
          </h3>
          <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
            {formatTime(chat.updatedAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="text-xs text-muted-foreground truncate max-w-[130px]">
            {chat.organization?.name || "Платформа"}
          </p>

          <p className="text-xs text-muted-foreground shrink-0 ml-auto font-medium">
            {chat._count.messages} сообщ.
          </p>
        </div>
      </div>
    </Button>
  );
};
