"use client"

import ButtonSubmitForm from "@/shared/ui/ButtonSubmitForm"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useActionState } from "react"
import { Controller, useForm } from "react-hook-form"
import { type SchemaPropsResetPassword, validationSchemaResetPassword } from "../model/schema"; // ← добавь схему
import { resetPasswordAction } from "@/app/actions/auth"
import { Field, FieldError } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { MailCheck } from "lucide-react"


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
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Восстановление пароля</h1>

      {state?.success && <div className="flex items-center gap-2"><MailCheck /><span>Ссылка для сброса пароля отправлена на вашу электронную почту</span></div>}
      {!state?.success && (
        <form action={onSubmit} className="flex flex-col gap-3 w-64 p-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
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
            title="Отправить ссылку для восстановления"
            className="h-auto whitespace-break-spaces"
          />

          <div className="grid justify-center gap-2 text-center">
            <Link className="text-sm hover:underline " href="/auth/sign-in">
              Вернуться к входу
            </Link>
          </div>

          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        </form>
      )}
    </div>
  )
}
