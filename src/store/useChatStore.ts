import { create } from "@/shared/lib/zustand"; // Наш кастомный умный импорт с автосбросом при логауте
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "support" | "admin"; // Расширили типы под наши 3 роли из Better Auth
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  activeTicketId: string | null; // ID реального открытого тикета из базы MySQL (изначально null)
  activeTicketTitle: string | null; // ID реального открытого тикета из базы MySQL (изначально null)
  setActiveTicketTitle: (id: string | null) => void; // Переключение диалогов в сайдбаре оператора
  initChat: (serverTicketId?: string) => void; // Функция инициализации (теперь принимает реальный ID с бэкенда)
  setActiveTicketId: (id: string | null) => void; // Переключение диалогов в сайдбаре оператора
  sendMessage: (text: string, sender?: "user" | "support") => void; // Локальный метод (для тестов/эмуляции)
  clearChat: () => void; // Полная очистка состояния чата
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      activeTicketTitle: null, // Изначально никакой чат не выбран, холостые Get-запросы блокируются
      activeTicketId: null, // Изначально никакой чат не выбран, холостые Get-запросы блокируются

      // 🎯 ИСПРАВЛЕНО: Теперь initChat принимает НАСТОЯЩИЙ ID, который мы получили от API-роута
      initChat: (serverTicketId) => {
        // Если сервер прислал реальный ID тикета, записываем его в стейт
        if (serverTicketId) {
          set({ activeTicketId: serverTicketId });
          return;
        }

        // Если ID не пришел и в сторе пусто, мы НЕ генерируем рандомный мусор,
        // чтобы TanStack Query не улетал в бесконечный цикл 404 ошибок.
        // Оставляем activeTicketId: null, пока кнопка клиента не создаст тикет на бэкенде.
      },

      // 🎯 СТРЕЛОЧНАЯ ФУНКЦИЯ: Управляет переключением активного диалога в стиле Telegram
      setActiveTicketTitle: (title) => set({ activeTicketTitle: title }),
      setActiveTicketId: (id) => {
        set({ activeTicketId: id });
        console.log(`[Zustand] Активный тикет переключен на: ${id}`);
        // Как только это поле меняется, TanStack Query автоматически сбрасывает старый кэш
        // и начинает скачивать сообщения для нового тикета из MySQL Beget
      },

      // Локальный метод отправки (оставляем его для совместимости интерфейса и локальной эмуляции)
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

        // Эмуляция автоответов бота (работает только при локальном тестировании)
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

      // Безопасный сброс активного окна (вызывается кнопкой "Решено" или при выходе из аккаунта)
      clearChat: () => set({ messages: [], activeTicketId: null }),
    }),
    {
      name: "tech-support-chat-v1", // Ключ для сохранения состояния в LocalStorage браузера
    },
  ),
);

// 1. Стабильные чистые функции-селекторы (Принимают state аргументом, а не вызывают .getState())
const selectActiveTicketTitle = (state: ChatState) => state.activeTicketTitle;
const selectSetActiveTicketTitle = (state: ChatState) =>
  state.setActiveTicketTitle;

const selectActiveTicketId = (state: ChatState) => state.activeTicketId;
const selectSetActiveTicketId = (state: ChatState) => state.setActiveTicketId;

const selectClearChat = (state: ChatState) => state.clearChat;
const selectChatMessages = (state: ChatState) => state.messages;

// =========================================================================
// 🚀 ТОП-СТАНДАРТ: РЕАКТИВНЫЕ ХУКИ-ОБЕРТКИ (Для идеального вызова в компонентах)
// =========================================================================

export const useActiveTicketTitle = () => useChatStore(selectActiveTicketTitle);
export const useSetActiveTicketTitle = () =>
  useChatStore(selectSetActiveTicketTitle);

// Возвращает строку activeTicketId. Компонент перерисуется ТОЛЬКО если изменился сам ID.
export const useActiveTicketId = () => useChatStore(selectActiveTicketId);

// Возвращает стабильную функцию переключения чатов. Компонент с ней ВООБЩЕ никогда не делает лишних ререндеров.
export const useSetActiveTicketId = () => useChatStore(selectSetActiveTicketId);

// Возвращает функцию очистки чата
export const useClearChat = () => useChatStore(selectClearChat);

// Возвращает массив сообщений. Перерисовывает компонент только при прилете новых сообщений.
export const useChatMessages = () => useChatStore(selectChatMessages);
