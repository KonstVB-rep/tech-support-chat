"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { changeEmail } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

type ChangeEmailResponse = { email: string };

const ChangeEmailForm = ({
  emailProfile,
  profileId,
}: {
  emailProfile: string;
  profileId: string;
}) => {
  const [email, setEmail] = useState(emailProfile);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation<ChangeEmailResponse, Error, string>(
    {
      mutationFn: async (newEmail: string) => {
        return await changeEmail(newEmail, profileId);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["session"] });
        toast.success("Email обновлён. Проверьте почту для подтверждения.");
        setEmail(data.email);
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message || "Ошибка при смене email");
      },
    },
  );

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    mutate(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="email">Электронная почта</Label>
        <Input
          id="email"
          placeholder="new@email.com"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className="field-height"
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || !email.trim()}
        className="ml-auto w-fit"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Сохранение...
          </>
        ) : (
          "Сменить email"
        )}
      </Button>
    </form>
  );
};

export default ChangeEmailForm;
