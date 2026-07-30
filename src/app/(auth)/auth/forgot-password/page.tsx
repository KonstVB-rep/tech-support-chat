"use client"

import { useActionState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { MailCheck } from "lucide-react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import { resetPasswordAction } from "@/app/actions/auth"
import { Field, FieldError } from "@/shared/ui/components/field"
import { Input } from "@/shared/ui/components/input"
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm"
import { type SchemaPropsResetPassword, validationSchemaResetPassword } from "../model/schema" // ← добавь схему

const initialState = {
  email: "",
}

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState(resetPasswordAction, undefined)

  const form = useForm<SchemaPropsResetPassword>({
    resolver: zodResolver(validationSchemaResetPassword),
    defaultValues: initialState,
    resetOptions: {
      keepDefaultValues: true,
    },
  })

  const onSubmit = (formData: FormData) => {
    formAction(formData)
  }

  const errorMessage = state?.error

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-2xl">Восстановление пароля</h1>

      {state?.success && (
        <div className="flex items-center gap-2">
          <MailCheck />
          <span>Ссылка для сброса пароля отправлена на вашу электронную почту</span>
        </div>
      )}
      {!state?.success && (
        <form action={onSubmit} className="flex w-64 flex-col gap-3 p-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  className="bg-card"
                  id="form-email"
                  name="email"
                  placeholder="example@email.ru"
                  required
                  type="email"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <ButtonSubmitForm
            aria-label="Отправить ссылку"
            className="h-auto whitespace-break-spaces"
            title="Отправить ссылку для восстановления"
          />

          <div className="grid justify-center gap-2 text-center">
            <Link className="text-sm hover:underline" href="/auth/sign-in">
              Вернуться к входу
            </Link>
          </div>

          {errorMessage && <p className="text-center text-red-500">{errorMessage}</p>}
        </form>
      )}
    </div>
  )
}
