// src/widgets/chat-window/ui/ChatHeaderActions.tsx
"use client"

import { OrgRole } from "@prisma/client"
import { Trash2 } from "lucide-react"
import { ChatMembersSheet, useDeleteChat } from "@/features/manage-chat-members"
import { USER_ROLE } from "@/shared/constants"
import { ProtectByRole } from "@/shared/lib/ProtectByRole"
import { Button } from "@/shared/ui/components/button"
import { useClearChat } from "@/store/useChatStore"
import SoundToggle from "@/widgets/chat-window/ui/SoundToggle"

interface ChatHeaderActionsProps {
  chatId: string
  currentMemberRole: OrgRole | null
}

export const ChatHeaderActions = ({ chatId, currentMemberRole }: ChatHeaderActionsProps) => {
  const clearChat = useClearChat()
  const { mutate: deleteChat, isPending: isDeleting } = useDeleteChat()

  const handleDeleteChat = () => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите НАВСЕГДА удалить эту тему и всю историю переписки?",
    )
    if (!confirmDelete) return
    deleteChat(chatId, { onSuccess: () => clearChat() })
  }

  return (
    <>
      <ProtectByRole
        currentMemberRole={currentMemberRole}
        requiredOrgRole={OrgRole.RESPONSIBLE}
        requiredRole="user"
      >
        <ChatMembersSheet chatId={chatId} />
      </ProtectByRole>

      <ProtectByRole
        currentMemberRole={currentMemberRole}
        requiredOrgRole={OrgRole.RESPONSIBLE}
        requiredRole="user"
      >
        <SoundToggle />
      </ProtectByRole>

      <ProtectByRole requiredRole={USER_ROLE.ADMIN}>
        <Button
          className="flex h-10 items-center justify-start gap-2 rounded-md text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
          disabled={isDeleting}
          onClick={handleDeleteChat}
          title="Удалить чат"
          variant="outline"
        >
          <Trash2 className="size-5" /> Удалить
        </Button>
      </ProtectByRole>
    </>
  )
}
