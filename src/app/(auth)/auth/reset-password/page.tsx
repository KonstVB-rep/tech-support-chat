"use client"

import { useActionState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { resetPasswordConfirmAction } from "@/app/actions/auth"
import { Field, FieldError } from "@/shared/ui/components/field"
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm"
import InputPassword from "@/shared/ui/custom/InputPassword"
import {
  type SchemaPropsResetPasswordConfirm,
  validationSchemaResetPasswordConfirm,
} from "../model/schema"

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
    formAction(formData)
  }

  const errorMessage = state?.error

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="before:-bottom-[18px] relative rounded-tl-4xl rounded-tr-2xl rounded-bl-4xl bg-accent p-4 before:absolute before:right-0 before:h-[18px] before:w-[18px] before:border-[9px] before:border-transparent before:border-t-[9px] before:border-t-accent before:border-r-[9px] before:border-r-accent before:bg-[#0a0a0a] before:content-['']">
        <p className="max-w-xs text-center text-gray-600">
          Придумайте новый пароль для вашего аккаунта
        </p>
      </div>

      <form action={onSubmit} className="flex w-64 flex-col gap-3 p-4">
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputPassword
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="new-password"
                className="field-height !bg-card"
                disabled={!token}
                id="password"
                placeholder="Новый пароль"
                value={field.value ?? ""}
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
              <InputPassword
                {...field}
                aria-invalid={fieldState.invalid}
                className="field-height !bg-card"
                disabled={!token}
                id="password"
                name="confirmPassword"
                placeholder="Повторите пароль"
                value={field.value ?? ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <ButtonSubmitForm aria-label="Сменить пароль" disabled={!token} title="Сменить пароль" />

        <div className="text-center">
          <Link className="text-gray-600 text-sm hover:underline" href="/auth/sign-in">
            Вернуться к входу
          </Link>
        </div>

        {errorMessage && <p className="text-center text-red-500 text-sm">{errorMessage}</p>}

        {state?.success && (
          <p className="text-center text-green-600">
            Пароль успешно изменён! Перенаправляем на страницу входа...
          </p>
        )}
      </form>
    </div>
  )
}
