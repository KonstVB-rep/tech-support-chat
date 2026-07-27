// src/features/manage-chat-members/api/useChatMembersMutations.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addChatMemberAction,
  removeChatMemberAction,
  updateChatTitleAction,
  getChatMembersAction,
  type EmployeeInChat,
  deleteChatAction,
} from "../actions";

export function useChatMembers(chatId: string, isOpen: boolean) {
  return useQuery<EmployeeInChat[]>({
    queryKey: ["chat-members-list", chatId],
    queryFn: async () => {
      const response = await getChatMembersAction({ chatId });
      if (!response.success)
        throw new Error(response.error || "Ошибка загрузки");
      return response.data;
    },
    enabled: isOpen && !!chatId,
    staleTime: 0,
  });
}

/**
 * 🔄 МУТАЦИЯ №1: Добавить человека
 */
export const useAddChatMember = (chatId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (targetProfileId: string) => {
      const res = await addChatMemberAction({ chatId, targetProfileId });
      if (!res.success) throw new Error(res.error || "Не удалось добавить");
      return res;
    },
    onSuccess: () => {
      toast.success("Сотрудник добавлен в тему");
      queryClient.invalidateQueries({
        queryKey: ["chat-members-list", chatId],
      });
    },
    onError: (error) => toast.error(error.message),
  });
};

/**
 * 🔄 МУТАЦИЯ №2: Удалить человека
 */
export const useRemoveChatMember = (chatId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (targetProfileId: string) => {
      const res = await removeChatMemberAction({ chatId, targetProfileId });
      if (!res.success) throw new Error(res.error || "Не удалось исключить");
      return res;
    },
    onSuccess: () => {
      toast.success("Сотрудник исключен из чата");
      queryClient.invalidateQueries({
        queryKey: ["chat-members-list", chatId],
      });
    },
    onError: (error) => toast.error(error.message),
  });
};

/**
 * 🔄 МУТАЦИЯ №3: Переименовать чат
 */
export const useUpdateChatTitle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { chatId: string; newTitle: string }) => {
      const res = await updateChatTitleAction(payload);
      if (!res.success) throw new Error(res.error || "Ошибка переименования");
      return res;
    },
    onSuccess: () => {
      toast.success("Тема успешно переименована");
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => toast.error(error.message),
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: string) => {
      const res = await deleteChatAction({ chatId });
      if (!res.success) throw new Error(res.error || "Не удалось удалить чат");
      return res;
    },
    onSuccess: () => {
      toast.success("Тема обращения полностью удалена из системы");
      // Мгновенно инвалидируем список чатов у админа, чтобы плашка пропала
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
