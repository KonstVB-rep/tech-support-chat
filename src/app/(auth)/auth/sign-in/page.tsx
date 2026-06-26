"use client"


import { authClient } from "@/app/lib/auth-client"
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm"
import { Field, FieldError } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { type SchemaPropsSignIn, validationSchemaSignIn } from "../model/schema"


const initialState = {
  email: "",
  password: "",
}

export default function SignInPage() {
  const router = useRouter()
  const form = useForm<SchemaPropsSignIn>({
    resolver: zodResolver(validationSchemaSignIn),
    defaultValues: initialState,
    resetOptions: {
      keepDefaultValues: true,
    },
  })
  // const [state, formAction] = useActionState(signInActionWith2FA, undefined);

  const onSubmit = async (values: SchemaPropsSignIn) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        rememberMe: false,
      },
      {
        async onSuccess(context) {
          // Если 2FA включена, Better Auth сам поймет это и выдаст true в этом флаге
          if (context.data.twoFactorRedirect) {
            router.replace("/auth/two-factor")
          } else {
            router.replace("/chats")
            toast.success("Вы успешно вошли!")
          }
        },
        async onError(_context) {
          toast.error("Не верный email или пароль")
        },
      },
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 w-full">
      <h1 className="text-2xl font-bold">Войти</h1>
      <form className="flex flex-col gap-3 w-64  p-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* <form action={onSubmit} className="flex flex-col gap-3 w-64  p-4"> */}
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
        <ButtonSubmitForm aria-label="Войти" title="Войти" />
        <div className="grid justify-center gap-2">
          <Link className="text-center block" href="/auth/forgot-password">
            Забыли пароль?
          </Link>
          {/* <span className="text-center block">Нет аккаунта?</span>
          <Link className="text-center block" href="/auth/sign-up">
            Зарегистрироваться
          </Link> */}
        </div>
        {/* {errorMessage && <p className="text-red-500">{errorMessage}</p>} */}
      </form>
    </div>
  )
}
