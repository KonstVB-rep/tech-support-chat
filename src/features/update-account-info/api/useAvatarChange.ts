// src/entities/user/api/useAvatarChange.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAvatarAction } from "./uploadAvatarAction";
import { removeAvatarAction } from "./removeAvatarAction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAvatarChange = (profileId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("profileId", profileId);
      const { url } = await uploadAvatarAction(formData);
      return url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Аватар обновлён");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Ошибка загрузки аватара");
    },
  });

  const remove = useMutation({
    mutationFn: () => removeAvatarAction(profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Аватар удалён");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Ошибка удаления аватара");
    },
  });

  return { upload, remove };
};
