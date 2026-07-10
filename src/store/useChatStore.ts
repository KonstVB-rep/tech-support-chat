// src/store/useChatStore.ts
import { create } from "@/shared/lib/zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "support" | "admin";
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  activeTicketId: string | null; // 🚀 В сторе остается ТОЛЬКО чистый ID тикета!
  initChat: (serverTicketId?: string) => void;
  setActiveTicketId: (id: string | null) => void;
  sendMessage: (text: string, sender?: "user" | "support") => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      activeTicketId: null,

      initChat: (serverTicketId) => {
        if (serverTicketId) {
          set({ activeTicketId: serverTicketId });
        }
      },

      // 🎯 ОСТАВЛЯЕМ СТРОГО ОДИН СЕТ: Он переключает только ID чата
      setActiveTicketId: (id) => {
        set({ activeTicketId: id });
        console.log(`[Zustand] Активный тикет переключен на: ${id}`);
      },

      sendMessage: (text, sender = "user") => {
        const newMessage: Message = {
          id: Math.random().toString(36).substring(7),
          text,
          sender,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        set((state) => ({ messages: [...state.messages, newMessage] }));

        if (sender === "user") {
          setTimeout(() => {
            const supportReplies = [
              "Принял в работу, одну минуту.",
              "Попробуйте перезагрузить страницу.",
              "Мы зафиксировали баг, уже чиним.",
              "Уточните, пожалуйста, какая у вас операционная система?",
            ];
            const randomReply =
              supportReplies[Math.floor(Math.random() * supportReplies.length)];
            get().sendMessage(randomReply, "support");
          }, 1500);
        }
      },

      clearChat: () => set({ messages: [], activeTicketId: null }),
    }),
    {
      name: "tech-support-chat-v1", // Ключ в LocalStorage браузера
      // 🚀 ПРЕДОХРАНИТЕЛЬ: Сохраняем на диск СТРОГО только ID активного чата
      partialize: (state) => ({
        activeTicketId: state.activeTicketId,
      }),
    },
  ),
);

// Селекторы стора
const selectActiveTicketId = (state: ChatState) => state.activeTicketId;
const selectSetActiveTicketId = (state: ChatState) => state.setActiveTicketId;
const selectClearChat = (state: ChatState) => state.clearChat;
const selectChatMessages = (state: ChatState) => state.messages;

export const useActiveTicketId = () => useChatStore(selectActiveTicketId);
export const useSetActiveTicketId = () => useChatStore(selectSetActiveTicketId);
export const useClearChat = () => useChatStore(selectClearChat);
export const useChatMessages = () => useChatStore(selectChatMessages);
