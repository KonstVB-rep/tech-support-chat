// src/store/useChatStore.ts

import type { OrgRole } from "@prisma/client"
import { persist } from "zustand/middleware"
import type { AttachmentMeta } from "@/entities/chat/api/types"
import { create } from "@/shared/lib/zustand"

type ReplyToData = {
  id: string
  text: string | null
  senderName: string
  attachments: AttachmentMeta[]
}

interface ChatState {
  activeTicketId: string | null
  setActiveTicketId: (id: string | null) => void
  clearChat: () => void

  currentOrganizationId: string | null
  currentMemberRole: OrgRole | null
  setCurrentOrganization: (id: string | null, role: OrgRole | null) => void
  clearOrganization: () => void
  replyTo: ReplyToData | null
  setReplyTo: (data: ReplyToData) => void
  clearReply: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      activeTicketId: null,
      replyTo: null,
      setReplyTo: (data) => set({ replyTo: data }),
      clearReply: () => set({ replyTo: null }),
      setActiveTicketId: (id) => {
        set({ activeTicketId: id })
      },
      clearChat: () => set({ activeTicketId: null }),

      currentOrganizationId: null,
      currentMemberRole: null,
      setCurrentOrganization: (id, role) =>
        set({ currentOrganizationId: id, currentMemberRole: role }),
      clearOrganization: () => set({ currentOrganizationId: null, currentMemberRole: null }),
    }),
    {
      name: "tech-support-chat-v1",
      partialize: (state) => ({
        activeTicketId: state.activeTicketId,
        currentOrganizationId: state.currentOrganizationId,
        currentMemberRole: state.currentMemberRole,
      }),
    },
  ),
)

// Селекторы — чат
const selectActiveTicketId = (state: ChatState) => state.activeTicketId
const selectSetActiveTicketId = (state: ChatState) => state.setActiveTicketId
const selectClearChat = (state: ChatState) => state.clearChat

// Селекторы — организация
const selectCurrentOrganizationId = (state: ChatState) => state.currentOrganizationId
const selectCurrentMemberRole = (state: ChatState) => state.currentMemberRole
const selectSetCurrentOrganization = (state: ChatState) => state.setCurrentOrganization
const selectClearOrganization = (state: ChatState) => state.clearOrganization

// Экспорты — чат
export const useActiveTicketId = () => useChatStore(selectActiveTicketId)
export const useSetActiveTicketId = () => useChatStore(selectSetActiveTicketId)
export const useClearChat = () => useChatStore(selectClearChat)

// Экспорты — организация
export const useCurrentOrganizationId = () => useChatStore(selectCurrentOrganizationId)
export const useCurrentMemberRole = () => useChatStore(selectCurrentMemberRole)
export const useSetCurrentOrganization = () => useChatStore(selectSetCurrentOrganization)
export const useClearOrganization = () => useChatStore(selectClearOrganization)
