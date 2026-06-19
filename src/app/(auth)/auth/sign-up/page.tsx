"use client"


import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useActionState } from "react"
import { Controller, useForm } from "react-hook-form"
import { type SchemaPropsSignUp, validationSchemaSignUp } from "../model/schema"
import { signUpAction } from "@/app/actions/auth"
import ButtonSubmitForm from "@/shared/ui/ButtonSubmitForm"
import { Field, FieldError } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"


const initialState = {
  name: "",
  email: "",
  password: "",
}

export default function SignUpPage() {
  const [state, formAction] = useActionState(signUpAction, undefined)
  const form = useForm<SchemaPropsSignUp>({
    resolver: zodResolver(validationSchemaSignUp),
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
      <h1 className="text-2xl font-bold">Регистрация</h1>
      <form action={onSubmit} className="flex flex-col gap-3 w-64 p-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                id="name"
                name="name"
                placeholder="Как вас называть?"
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                id="form-password"
                name="password"
                placeholder="*******"
                required
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <ButtonSubmitForm aria-label="Регистрация" title="Регистрация" />
        <div className="grid justify-center gap-2">
          <span className="text-center block">Есть аккаунт?</span>
          <Link className="text-center block" href="/auth/sign-in">
            Войти
          </Link>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </form>
    </div>
  )
}
