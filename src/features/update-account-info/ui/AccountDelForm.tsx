"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { deleteAccountFormAction } from "@/features/update-account-info/api/deleteAccountAction"
import { Button } from "@/shared/ui/components/button"
import { Label } from "@/shared/ui/components/label"
import InputPassword from "@/shared/ui/custom/InputPassword"

export const AccountDelForm = () => {
  const [state, formAction, isPending] = useActionState(deleteAccountFormAction, {
    success: false,
    message: null,
    error: null,
  })
  const router = useRouter()

  useEffect(() => {
    if (state.success && state.message) {
      router.push("/login")
    }
  }, [state.success, state.message, router])

  return (
    <form action={formAction} className="flex w-full max-w-2xl flex-col gap-3">
      <div className="flex flex-col gap-4">
        {state.error && <p className="text-destructive text-sm">{state.error}</p>}

        <div className="grid gap-2">
          <Label htmlFor="del-password">Пароль для подтверждения</Label>
          <InputPassword
            className="field-height"
            disabled={isPending}
            id="del-password"
            name="password"
            placeholder="••••••••"
            required
            type="password"
          />
        </div>
      </div>
      <Button className="w-fit" disabled={isPending} title={"Удалить аккаунт"} type="submit">
        {isPending ? "Удаление..." : "Удалить аккаунт"}
      </Button>
    </form>
  )
}

export const AccountDelFormSkeleton = () => {
  return (
    <div className="flex w-full max-w-2xl animate-pulse select-none flex-col gap-3">
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <div className="h-4 w-44 rounded-md bg-muted" />

          <div className="field-height h-10 w-full rounded-lg bg-muted" />
        </div>
      </div>

      <div className="h-9 w-36 shrink-0 rounded-lg bg-muted" />
    </div>
  )
}
