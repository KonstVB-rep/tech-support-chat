// src/store/useChatStore.ts
import { create } from "@/shared/lib/zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  activeTicketId: string | null;
  setActiveTicketId: (id: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      activeTicketId: null,

      setActiveTicketId: (id) => {
        set({ activeTicketId: id });
        console.log(`[Zustand] Активный тикет переключен на: ${id}`);
      },

      clearChat: () => set({ activeTicketId: null }),
    }),
    {
      name: "tech-support-chat-v1",
      partialize: (state) => ({
        activeTicketId: state.activeTicketId,
      }),
    },
  ),
);

const selectActiveTicketId = (state: ChatState) => state.activeTicketId;
const selectSetActiveTicketId = (state: ChatState) => state.setActiveTicketId;
const selectClearChat = (state: ChatState) => state.clearChat;

export const useActiveTicketId = () => useChatStore(selectActiveTicketId);
export const useSetActiveTicketId = () => useChatStore(selectSetActiveTicketId);
export const useClearChat = () => useChatStore(selectClearChat);
