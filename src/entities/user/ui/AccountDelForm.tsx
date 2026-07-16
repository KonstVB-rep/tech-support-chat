"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { deleteAccountFormAction } from "@/entities/user/api/deleteAccountAction";
import { Button } from "@/shared/ui/button";

const AccountDelForm = () => {
  const [state, formAction, isPending] = useActionState(deleteAccountFormAction, {
    success: false,
    message: null,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.message) {
      router.push("/login");
    }
  }, [state.success, state.message, router]);

  return (
    <form action={formAction} className="flex flex-col gap-6 w-full max-w-2xl">
        <div className="flex flex-col gap-4">
          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <div className="grid gap-2">
            <Label htmlFor="del-password">Пароль для подтверждения</Label>
            <Input
              id="del-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              className="field-height"
            />
          </div>
        </div>
        <Button className="w-fit" type="submit" title={"Удалить аккаунт"} disabled={isPending}>
              {isPending ? "Удаление..." : "Удалить аккаунт"}
        </Button>
    </form>
  );
};

export default AccountDelForm;