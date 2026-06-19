import { apiConfig } from "@/app/api/api.config";
import { useSetActiveTicketId } from "@/store/useChatStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTopic = () => {
  const queryClient = useQueryClient();

  const setActiveTopicId = useSetActiveTicketId();

  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch("api/chats", apiConfig.post({ title }));

      if (!res.ok) throw new Error("Не удалось создать тему");
      return res.json();
    },
    onSuccess: (newChat) => {
      // Инвалидируем кэш списка тем для нашего нового роута
      queryClient.invalidateQueries({ queryKey: ["support-chats"] });

      // Активируем новый чат на экране справа
      setActiveTopicId(newChat.id);
    },
  });
};
