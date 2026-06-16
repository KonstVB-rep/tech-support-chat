import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  roomId: string | null;
  initChat: () => void;
  sendMessage: (text: string, sender?: "user" | "support") => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      roomId: null,

      initChat: () => {
        if (!get().roomId) {
          set({
            roomId: `room_${Math.random().toString(36).substring(7)}`,
            messages: [
              {
                id: "welcome",
                text: "Здравствуйте! Опишите вашу проблему, и мы постараемся вам помочь. 😉",
                sender: "support",
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ],
          });
        }
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

      clearChat: () => set({ messages: [], roomId: null }),
    }),
    {
      name: "tech-support-chat-v1",
    },
  ),
);
