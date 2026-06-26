"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrganization } from "./deleteOrganization";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (ids: string | string[]) => deleteOrganization(ids),
    onSuccess: (result) => {
  
      
      // ✅ 1. Очищаем React Query кэш (для клиентских хуков)
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      
      // ✅ 2. Проверяем текущий URL
      const currentPath = window.location.pathname;
      const currentId = currentPath.split("/").pop() ?? "";
      
      if (result.ids.includes(currentId)) {
        // ✅ Удаляли текущую организацию — редирект на список
        router.push("/organizations");
        toast.success("Организация удалена");
      } else {
        // ✅ 3. Обновляем серверные компоненты
        router.refresh();
        toast.success(`Удалено организаций: ${result.deleted}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};