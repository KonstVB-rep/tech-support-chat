import * as z from "zod";

export const supportEngineerFormSchema = z.object({
  email: z.email("Некорректный email"),
  name: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  password: z.string().min(8, "Пароль должен содержать не менее 8 символов."),
  phone: z.string().optional(),
});

export type SupportEngineerFormValues = z.infer<
  typeof supportEngineerFormSchema
>;

export const updateSupportEngineerSchema = z.object({
  email: z.email("Некорректный email"),
  name: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  password: z
    .string()
    .min(8, "Пароль должен содержать не менее 8 символов.")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
});

export type UpdateSupportEngineerFormValues = z.infer<
  typeof updateSupportEngineerSchema
>;
