"use client";

import { useActionState } from "react";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { changePassword } from "@/app/actions/auth";

const PasswordChangeForm = () => {
  const queryClient = useQueryClient();
  const [state, formAction, isPending] = useActionState(
    changePassword,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Пароль успешно изменён");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, queryClient]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="current_password">Текущий пароль</Label>
        <Input
          id="current_password"
          name="currentPassword"
          placeholder="••••••••"
          required
          type="password"
          disabled={isPending}
          className="field-height"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="new_password">Новый пароль</Label>
        <Input
          id="new_password"
          name="newPassword"
          placeholder="••••••••"
          required
          type="password"
          disabled={isPending}
          className="field-height"
        />
      </div>

      <Button type="submit" disabled={isPending} className="ml-auto w-fit">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Сохранение...
          </>
        ) : (
          "Сменить пароль"
        )}
      </Button>
    </form>
  );
};

export default PasswordChangeForm;
