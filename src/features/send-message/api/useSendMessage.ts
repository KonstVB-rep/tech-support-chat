// src/features/send-message/api/useSendMessage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiConfig } from "@/shared/api/config";
import { socket } from "@/shared/api/socket";
import { MessageData } from "@/widgets/chat-window/api/useGetMessages";

interface SendPayload {
  chatId: string;
  text: string;
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, text }: SendPayload) => {
      const res = await fetch("/api/messages", apiConfig.post({ chatId, text }));
      if (!res.ok) throw new Error("Не удалось отправить сообщение");
      return res.json();
    },
    onSuccess: (newMessage: MessageData) => {
      // 1. Мгновенно пушим сообщение в локальный кэш TanStack Query у отправителя
      queryClient.setQueryData<MessageData[]>(["chat-messages", newMessage.chatId], (oldMessages = []) => {
        if (oldMessages.some((m) => m.id === newMessage.id)) return oldMessages;
        return [...oldMessages, newMessage];
      });

      // 2. 🎯 ТОТ САМЫЙ ПУШ: Шлём полную структуру данных в сокет-сервер :4000
      if (socket.connected) {
        socket.emit("send_message", newMessage);
      }

      // 3. Обновляем сайдбар, чтобы поднять чат наверх
      queryClient.invalidateQueries({ queryKey: ["support-chats"] });
    },
  });
};
