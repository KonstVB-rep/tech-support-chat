"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOrganization } from "./updateOrganization";

export const useUpdateOrganization = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      updateOrganization(id, data),
    onSuccess: () => {
      router.refresh();
      toast.success("Организация обновлена");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};