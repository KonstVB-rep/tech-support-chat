import * as z from "zod"

export const StaffMemberFormSchema = z.object({
  email: z.email("Некорректный email"),
  name: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  password: z.string().min(8, "Пароль должен содержать не менее 8 символов."),
  phone: z.string().optional(),
  role: z.boolean(),
})

export type StaffMemberFormValues = z.infer<typeof StaffMemberFormSchema>

export const updateStaffMemberSchema = z.object({
  email: z.email("Некорректный email"),
  name: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  password: z
    .string()
    .min(8, "Пароль должен содержать не менее 8 символов.")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  role: z.boolean(),
})

export type UpdateStaffMemberFormValues = z.infer<typeof updateStaffMemberSchema>
