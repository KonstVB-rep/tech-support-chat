"use client"

import { useActionState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { changePassword } from "@/app/actions/auth"
import { Button } from "@/shared/ui/components/button"
import { Label } from "@/shared/ui/components/label"
import InputPassword from "@/shared/ui/custom/InputPassword"

const PasswordChangeForm = () => {
  const queryClient = useQueryClient()
  const [state, formAction, isPending] = useActionState(changePassword, undefined)

  useEffect(() => {
    if (state?.success) {
      queryClient.invalidateQueries({ queryKey: ["session"] })
      toast.success("Пароль успешно изменён")
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, queryClient])

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid gap-2">
        <Label htmlFor="current_password">Текущий пароль</Label>
        <InputPassword
          className="field-height"
          disabled={isPending}
          id="current_password"
          name="currentPassword"
          placeholder="••••••••"
          required
          type="password"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="new_password">Новый пароль</Label>
        <InputPassword
          className="field-height"
          disabled={isPending}
          id="new_password"
          name="newPassword"
          placeholder="••••••••"
          required
          type="password"
        />
      </div>

      <Button className="ml-auto w-fit" disabled={isPending} type="submit">
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
  )
}

export default PasswordChangeForm
