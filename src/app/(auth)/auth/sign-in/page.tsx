"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { authClient } from "@/app/lib/auth-client"
import { Button } from "@/shared/ui/components/button"
import { Field, FieldError } from "@/shared/ui/components/field"
import { Input } from "@/shared/ui/components/input"
import InputPassword from "@/shared/ui/custom/InputPassword"
import { type SchemaPropsSignIn, validationSchemaSignIn } from "../model/schema"

const initialState = {
  email: "",
  password: "",
}

export default function SignInPage() {
  const router = useRouter()

  // 🚀 БЕСТ-ПРАКТИКС: Достаем formState для контроля состояния отправки формы
  const form = useForm<SchemaPropsSignIn>({
    resolver: zodResolver(validationSchemaSignIn),
    defaultValues: initialState,
    resetOptions: {
      keepDefaultValues: true,
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: SchemaPropsSignIn) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        rememberMe: false,
      },
      {
        async onSuccess(context) {
          if (context.data.twoFactorRedirect) {
            router.replace("/auth/two-factor")
          } else {
            router.replace("/chats")
            toast.success("Вы успешно вошли!")
          }
        },
        async onError(_context) {
          toast.error("Неверный email или пароль")
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <form
        className="flex w-64 flex-col gap-3 p-4"
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="email"
                className="field-height !bg-card"
                id="form-email"
                placeholder="example@email.ru"
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Пароль */}
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputPassword
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
                className="field-height !bg-card"
                id="password"
                placeholder="••••••••"
                value={field.value ?? ""}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          aria-label="Отправить форму"
          className="flex w-full items-center"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader className="h-5 w-5 animate-spin" />
              Вход...
            </span>
          ) : (
            "Войти"
          )}
        </Button>

        <div className="grid justify-center gap-2">
          <Link
            className="block text-center text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="/auth/forgot-password"
          >
            Забыли пароль?
          </Link>
        </div>
      </form>
    </div>
  )
}
