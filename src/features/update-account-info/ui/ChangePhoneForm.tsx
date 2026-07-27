"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import PhoneInput from "@/shared/ui/custom/PhoneInput"; // Убедитесь, что импорт правильный

import type { Profile } from "@prisma/client";
import { ActionStateWithData } from "@/shared/lib/types";
import { changePhone } from "../api/changePhone";

const ChangePhoneForm = ({
  phoneProfile,
  profileId,
}: {
  phoneProfile: string | null;
  profileId: string;
}) => {
  const [phone, setPhone] = useState(phoneProfile);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation<
    ActionStateWithData<Profile>,
    Error,
    string
  >({
    mutationFn: async (newPhone: string) => {
      return await changePhone(newPhone, profileId);
    },
    onSuccess: (res) => {
      if (!res.success || !res.data) {
        toast.error(res.error || "Не удалось обновить телефон");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Телефон успешно обновлён.");

      if (res.data.phone) {
        setPhone(res.data.phone);
      }

      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Ошибка при смене телефона");
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = phone?.trim();
    if (!trimmed) return;
    mutate(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 w-full max-w-2xl"
    >
      <div className="grid gap-2">
        <Label htmlFor="phone">Телефон</Label>

        <PhoneInput
          id="phone"
          value={phone ?? ""}
          onAccept={(value) => setPhone(value)} // Исправлено с (e) => setPhone(e.target.value)
          required
          className="field-height dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || !phone?.trim()}
        className="ml-auto w-fit"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Сохранение...
          </>
        ) : (
          "Сменить телефон"
        )}
      </Button>
    </form>
  );
};

export default ChangePhoneForm;
