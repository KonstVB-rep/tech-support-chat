import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiConfig } from "@/shared/api/config";
import { useSetActiveTicketId } from "@/store/useChatStore";

interface CreateTopicPayload {
  title: string;
  organizationId: string;
}

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  const setActiveTopicId = useSetActiveTicketId();

  return useMutation({
    mutationFn: async (data: CreateTopicPayload) => {
      const { title, organizationId } = data;
      const res = await fetch(
        "/api/chats/create",
        apiConfig.post({ title, organizationId }),
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Не удалось создать тему обращением",
        );
      }

      return res.json();
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      if (newChat?.id) {
        setActiveTopicId(newChat.id);
      }
    },
  });
};
