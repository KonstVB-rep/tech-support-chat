// src/widgets/sidebar/ui/Sidebar.tsx
"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { authClient } from "@/app/lib/auth-client"
import { CreateTopicDialog } from "@/features/create-topic"
import { Input } from "@/shared/ui/components/input"
import { SIDEBAR_TYPES, type SidebarTypes } from "@/widgets/types"
import { useGetChats } from "../api/useGetChats"
import SidebarContent from "./SidebarTypes/SidebarContent"

type SidebarProps = {
  sidebarType: SidebarTypes
}

const Sidebar = ({ sidebarType }: SidebarProps) => {
  return (
    <div className="flex h-full">
      <div className="flex h-full flex-1 select-none flex-col border-border border-r bg-primary-foreground">
        {sidebarType === SIDEBAR_TYPES.CHATS && <SideBarChats />}
      </div>
    </div>
  )
}

export default Sidebar

const SideBarChats = () => {
  const { data: session } = authClient.useSession()
  const [search, setSearch] = useState("")
  const { data: chats = [], isLoading } = useGetChats()

  const filteredChats = chats.filter((chat) =>
    chat.title?.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <div className="p-4">
        <h2 className="flex items-center justify-between gap-2 font-bold text-lg tracking-tight">
          <span className="uppercase">Чаты</span>
          {(session?.user?.role === "support" || session?.user?.role === "admin") && (
            <CreateTopicDialog />
          )}
        </h2>

        <div className="relative mt-3 flex items-center">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="h-9 rounded-xl border-none bg-muted/50 pl-9 focus-visible:ring-1 focus-visible:ring-primary"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск диалогов..."
            type="text"
            value={search}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col py-2">
        {!chats.length && isLoading ? (
          <div className="animate-pulse px-4 py-6 text-center text-muted-foreground text-xs">
            Загрузка чатов...
          </div>
        ) : (
          <SidebarContent.Chats chats={filteredChats} />
        )}
      </div>
    </>
  )
}
