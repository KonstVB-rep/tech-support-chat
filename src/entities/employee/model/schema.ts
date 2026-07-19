import * as z from "zod";

export const employeeFormSchema = z.object({
  email: z.email("Некорректный email"),
  name: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  position: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(8, "Пароль должен содержать не менее 8 символов."),
  role: z.enum(["RESPONSIBLE", "MEMBER"], {
    message: "Выберите роль",
  }),
});

export const updateEmployeeFormSchema = z.object({
  email: z.email("Некорректный email").optional(),
  name: z
    .string()
    .min(2, "Имя должно содержать не менее 2 символов.")
    .optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["RESPONSIBLE", "MEMBER"], {
    message: "Выберите роль",
  }),
});

export const updateEmployeeRoleFormSchema = z.object({
  role: z.enum(["RESPONSIBLE", "MEMBER"], {
    message: "Выберите роль",
  }),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export type UpdateEmployeeFormValues = z.infer<typeof updateEmployeeFormSchema>;

export type UpdateEmployeeRoleFormValues = z.infer<
  typeof updateEmployeeRoleFormSchema
>;
