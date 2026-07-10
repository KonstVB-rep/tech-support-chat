// src/features/manage-chat-members/ui/ChatMembersSheet.tsx
"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/shared/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Users, UserPlus, UserMinus, Loader } from "lucide-react";
import { useChatMembers, useAddChatMember, useRemoveChatMember } from "../api/useChatMembersMutations";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

interface ChatMembersSheetProps {
  chatId: string;
}

export const ChatMembersSheet = ({ chatId }: ChatMembersSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { data: employees = [], isLoading } = useChatMembers(chatId, isOpen);
  const { mutate: addMember, isPending: isAdding } = useAddChatMember(chatId);
  const { mutate: removeMember, isPending: isRemoving } = useRemoveChatMember(chatId);

  const isMutating = isAdding || isRemoving;

  const renderList = () => (
    <div className="space-y-2.5 p-4 max-h-[350px] overflow-y-auto pr-1 select-none">
      {isLoading ? (
        <div className="flex items-center justify-center py-6 text-muted-foreground gap-2 text-xs">
          <Loader className="size-4 animate-spin text-blue-600" /> Синхронизация списка...
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center text-xs text-muted-foreground py-6">
          Доступные сотрудники организации не найдены
        </div>
      ) : (
        employees.map((emp) => (
          <div 
            key={emp.profileId} 
            className="flex items-center justify-between p-2 rounded-xl border border-border/40 bg-muted/5"
          >
            <span className="text-xs font-semibold truncate max-w-[170px] md:max-w-[200px]">
              {emp.name}
            </span>
            
            {emp.isInChat ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={isMutating}
                className="h-8 rounded-lg text-xs text-destructive hover:bg-destructive/5 px-2.5 font-medium"
                onClick={() => removeMember(emp.profileId)}
              >
                <UserMinus className="size-3.5 mr-1" /> Исключить
              </Button>
            ) : (
              <Button
                size="sm"
                disabled={isMutating}
                className="h-8 rounded-lg text-xs px-3 font-medium bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => addMember(emp.profileId)}
              >
                <UserPlus className="size-3.5 mr-1" /> Добавить
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-xl size-9 text-muted-foreground hover:text-foreground">
            <Users className="size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 rounded-xl shadow-2xl border-border/60" align="end">
          <div className="px-4 pt-3 pb-1 border-b border-border/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Доступы к переписке</h4>
          </div>
          {renderList()}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl size-9 text-muted-foreground active:bg-muted">
          <Users className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-2xl pb-4">
        <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 my-2" />
        <DrawerHeader className="text-left px-4 pt-1">
          <DrawerTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Участники обсуждения
          </DrawerTitle>
        </DrawerHeader>
        {renderList()}
      </DrawerContent>
    </Drawer>
  );
};
