"use client";

import { deleteAccountFormAction } from "@/features/update-account-info/api/deleteAccountAction";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export const AccountDelForm = () => {
  const [state, formAction, isPending] = useActionState(
    deleteAccountFormAction,
    {
      success: false,
      message: null,
      error: null,
    },
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.message) {
      router.push("/login");
    }
  }, [state.success, state.message, router]);

  return (
    <form action={formAction} className="flex flex-col gap-3 w-full max-w-2xl">
      <div className="flex flex-col gap-4">
        {state.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

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
      <Button
        className="w-fit"
        type="submit"
        title={"Удалить аккаунт"}
        disabled={isPending}
      >
        {isPending ? "Удаление..." : "Удалить аккаунт"}
      </Button>
    </form>
  );
};

export const AccountDelFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl animate-pulse select-none">
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <div className="h-4 w-44 bg-muted rounded-md" />

          <div className="w-full h-10 bg-muted rounded-lg field-height" />
        </div>
      </div>

      <div className="h-9 w-36 bg-muted rounded-lg shrink-0" />
    </div>
  );
};
