"use client"

import { useEffect, useState } from "react"
import { Loader, UserMinus, UserPlus, Users } from "lucide-react"
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery"
import { Button } from "@/shared/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/components/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/components/drawer"
import {
  useAddChatMember,
  useChatMembers,
  useRemoveChatMember,
} from "../api/useChatMembersMutations"

interface ChatMembersSheetProps {
  chatId: string
}

export const ChatMembersSheet = ({ chatId }: ChatMembersSheetProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false) // 🔥 Добавили стейт монтирования
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { data: employees = [], isLoading } = useChatMembers(chatId, isOpen)
  const { mutate: addMember, isPending: isAdding } = useAddChatMember(chatId)
  const { mutate: removeMember, isPending: isRemoving } = useRemoveChatMember(chatId)

  const isMutating = isAdding || isRemoving

  const renderList = () => (
    <div className="max-h-[350px] select-none space-y-2.5 overflow-y-auto p-4 pr-1">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground text-xs">
          <Loader className="size-4 animate-spin text-blue-600" /> Синхронизация списка...
        </div>
      ) : employees.length === 0 ? (
        <div className="py-6 text-center text-muted-foreground text-xs">
          Доступные сотрудники организации не найдены
        </div>
      ) : (
        employees.map((emp) => (
          <div
            className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/5 p-2"
            key={emp.profileId}
          >
            <span className="max-w-[170px] truncate font-semibold text-xs md:max-w-[200px]">
              {emp.name}
            </span>

            {emp.isInChat ? (
              <Button
                className="h-8 rounded-lg px-2.5 font-medium text-destructive text-xs hover:bg-destructive/5"
                disabled={isMutating}
                onClick={() => removeMember(emp.profileId)}
                size="sm"
                variant="ghost"
              >
                <UserMinus className="mr-1 size-3.5" /> Исключить
              </Button>
            ) : (
              <Button
                className="h-8 rounded-lg bg-blue-600 px-3 font-medium text-white text-xs hover:bg-blue-700"
                disabled={isMutating}
                onClick={() => addMember(emp.profileId)}
                size="sm"
              >
                <UserPlus className="mr-1 size-3.5" /> Добавить
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  )

  if (!isMounted) {
    return (
      <Button
        className="flex h-10 items-center justify-start gap-2 rounded-full bg-primary/15 text-primary hover:bg-primary/30 focus-visible:bg-primary/30"
        size="icon"
      >
        <Users className="size-5" /> Пользователи
      </Button>
    )
  }

  if (isDesktop) {
    return (
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button className="h-10 items-center justify-start gap-2 rounded-md bg-primary/15 text-primary hover:bg-primary/30 focus-visible:bg-primary/30">
            <Users className="size-5" /> Пользователи
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="sr-only">Edit profile</DialogTitle>
            <DialogDescription className="sr-only"></DialogDescription>
          </DialogHeader>
          {renderList()}
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer onOpenChange={setIsOpen} open={isOpen}>
      <DrawerTrigger asChild>
        <Button
          className="flex h-10 rounded-md bg-primary/15 text-primary hover:bg-primary/30 focus-visible:bg-primary/30 md:hidden"
          size="icon"
        >
          <Users className="size-5" /> Пользователи
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-2xl pb-4">
        <div className="mx-auto my-2 h-1.5 w-12 rounded-full bg-muted-foreground/20" />
        <DrawerHeader className="px-4 pt-1 text-left">
          <DrawerTitle className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
            Участники
          </DrawerTitle>
        </DrawerHeader>
        {renderList()}
      </DrawerContent>
    </Drawer>
  )
}
