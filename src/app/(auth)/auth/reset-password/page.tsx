"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import {
    type SchemaPropsResetPasswordConfirm,
    validationSchemaResetPasswordConfirm,
} from "../model/schema"
import { resetPasswordConfirmAction } from "@/app/actions/auth"
import ButtonSubmitForm from "@/shared/ui/ButtonSubmitForm"
import { Field, FieldError } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"


const initialState = {
  password: "",
  confirmPassword: "",
}

export default function ResetPasswordConfirmPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const [state, formAction] = useActionState(resetPasswordConfirmAction, undefined)

  const form = useForm<SchemaPropsResetPasswordConfirm>({
    resolver: zodResolver(validationSchemaResetPasswordConfirm),
    defaultValues: initialState,
    resetOptions: {
      keepDefaultValues: true,
    },
  })

  useEffect(() => {
    let timeout = null
    if (state?.success) {
      toast.success("Пароль успешно изменён!")
      timeout = setTimeout(() => {
        router.push("/auth/sign-in")
      }, 1500)
    }
    ;() => {
      if (timeout) clearTimeout(timeout)
    }
  }, [state?.success, router])

  const onSubmit = (formData: FormData) => {
    if (!token) {
      toast.error("Токен отсутствует или недействителен")
      return
    }
    formData.append("token", token)
    console.log(Object.fromEntries(formData), "formData")
    formAction(formData)
  }

  const errorMessage = state?.error

  console.log(token, "token")

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="relative bg-accent p-4 rounded-tr-2xl rounded-bl-4xl rounded-tl-4xl before:absolute before:content-[''] before:w-[18px] before:h-[18px] before:border-[9px] before:border-transparent before:border-t-[9px] before:border-t-accent before:border-r-[9px] before:border-r-accent before:bg-[#0a0a0a] before:right-0 before:-bottom-[18px]">
        <p className="text-gray-600 text-center max-w-xs">
          Придумайте новый пароль для вашего аккаунта
        </p>
      </div>

      <form action={onSubmit} className="flex flex-col gap-3 w-64 p-4">
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                disabled={!token}
                id="form-password"
                name="password"
                placeholder="Новый пароль"
                required
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                disabled={!token}
                id="form-confirm-password"
                name="confirmPassword"
                placeholder="Повторите пароль"
                required
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <ButtonSubmitForm aria-label="Сменить пароль" disabled={!token} title="Сменить пароль" />

        <div className="text-center">
          <Link className="text-sm text-gray-600 hover:underline" href="/auth/sign-in">
            Вернуться к входу
          </Link>
        </div>

        {errorMessage && <p className="text-red-500 text-center text-sm">{errorMessage}</p>}

        {state?.success && (
          <p className="text-green-600 text-center">
            Пароль успешно изменён! Перенаправляем на страницу входа...
          </p>
        )}
      </form>
    </div>
  )
}
