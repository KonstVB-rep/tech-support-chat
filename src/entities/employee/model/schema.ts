import * as z from "zod";

export const employeeFormSchema = z.object({
  email: z.email("Некорректный email"),
  name: z.string().min(2, "Имя должно содержать не менее 2 символов."),
  position: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["RESPONSIBLE", "MEMBER"], {
    message: "Выберите роль",
  }),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
