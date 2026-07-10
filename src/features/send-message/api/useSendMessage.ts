// src/features/send-message/api/useSendMessage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiConfig } from "@/shared/api/config";

// Контракт входящих параметров для мутации
interface SendPayload {
  chatId: string;
  text: string;
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, text }: SendPayload) => {
      const res = await fetch(
        `/api/chats/${chatId}/messages`,
        apiConfig.post({ chatId, text }),
      );
      if (!res.ok) throw new Error("Не удалось отправить сообщение");
      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
