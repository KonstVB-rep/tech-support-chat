"use client";

import { authClient } from "@/app/lib/auth-client";
import { Field, FieldError, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type SchemaPropsSignIn,
  validationSchemaSignIn,
} from "../model/schema";
import InputPassword from "@/shared/ui/custom/InputPassword";
import { Button } from "@/shared/ui/button";
import { Loader } from "lucide-react";

const initialState = {
  email: "",
  password: "",
};

export default function SignInPage() {
  const router = useRouter();

  // 🚀 БЕСТ-ПРАКТИКС: Достаем formState для контроля состояния отправки формы
  const form = useForm<SchemaPropsSignIn>({
    resolver: zodResolver(validationSchemaSignIn),
    defaultValues: initialState,
    resetOptions: {
      keepDefaultValues: true,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: SchemaPropsSignIn) => {
    return await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        rememberMe: false,
      },
      {
        async onSuccess(context) {
          if (context.data.twoFactorRedirect) {
            router.replace("/auth/two-factor");
          } else {
            router.replace("/chats");
            toast.success("Вы успешно вошли!");
          }
        },
        async onError(_context) {
          toast.error("Неверный email или пароль");
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 w-full">
      <form
        className="flex flex-col gap-3 w-64 p-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Email */}
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="email"
                id="form-email"
                placeholder="example@email.ru"
                required
                className="field-height !bg-card"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Пароль */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputPassword
                {...field}
                value={field.value ?? ""}
                id="password"
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
                placeholder="••••••••"
                className="field-height !bg-card"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          aria-label="Отправить форму"
          className="flex items-center w-full"
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
            className="text-center block text-sm text-muted-foreground hover:text-foreground transition-colors"
            href="/auth/forgot-password"
          >
            Забыли пароль?
          </Link>
        </div>
      </form>
    </div>
  );
}
