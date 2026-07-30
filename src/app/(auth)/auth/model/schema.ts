import { z } from "zod"

export const validationSchemaSignIn = z.object({
  email: z.email("Некорректный Email"),
  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов")
    .max(30, "Пароль должен содержать не более 30 символов"),
})

export const validationSchemaSignUp = validationSchemaSignIn.extend({
  name: z.string().min(3, "Имя должно содержать минимум 3 символа"),
})

export const validationSchemaResetPassword = z.object({
  email: z.email("Введите корректный email"),
})

export const validationSchemaResetPasswordConfirm = z
  .object({
    password: z
      .string()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .max(30, "Пароль должен содержать не более 30 символов"),
    confirmPassword: z.string(),
    token: z.string().nonempty(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Введите текущий пароль"),
  newPassword: z.string().min(8, "Пароль должен быть не менее 8 символов"),
})

export type SchemaPropsSignIn = z.infer<typeof validationSchemaSignIn>
// export type SchemaPropsSignUp = z.infer<typeof validationSchemaSignUp>;
export type SchemaPropsResetPassword = z.infer<typeof validationSchemaResetPassword>

export type SchemaPropsResetPasswordConfirm = z.infer<typeof validationSchemaResetPasswordConfirm>

// export type SchemaChangePassword = z.infer<typeof passwordSchema>;
