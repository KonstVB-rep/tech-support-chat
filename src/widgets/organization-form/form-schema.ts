import * as z from "zod"
export const formSchema = z
  .object({
    name: z.string().min(2, "Название должно содержать не менее 2 символов."),
    legalAddress: z
      .string()
      .min(2, "Адрес должен содержать не менее 2 символов."),
    actualAddress: z
      .string()
      .min(2, "Адрес должен содержать не менее 2 символов."),

    inn: z.preprocess(
      (val) => (val === "" ? null : val),
      z
        .string()
        .regex(/^\d{10,12}$/, "ИНН должен содержать только цифры")
        .refine((val) => !val || val.length === 10 || val.length === 12, {
          message: "ИНН должен содержать 10 или 12 цифр",
        })
        .nullable()
        .optional(),
    ),

    contractNumber: z
      .string()
      .min(3, "Номер договора должен содержать не менее 3 символов."),

    supportHours: z.string().min(1, "Укажите количество часов"),

    contractStart: z.preprocess(
      (val) => {
        if (val instanceof Date) return val.toISOString();
        if (!val) return "";
        return val;
      },
      z.string().min(1, "Укажите дату начала"),
    ),

    contractEnd: z.preprocess(
      (val) => {
        if (val instanceof Date) return val.toISOString();
        if (!val) return "";
        return val;
      },
      z.string().min(1, "Укажите дату окончания"),
    ),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (data.contractStart) {
      const start = new Date(data.contractStart);
      if (start < now) {
        ctx.addIssue({
          code: "custom",
          message: "Дата начала не может быть в прошлом",
          path: ["startContract"],
        });
      }
    }
    if (data.contractStart && data.contractEnd) {
      const start = new Date(data.contractStart);
      const end = new Date(data.contractEnd);

      if (end <= start) {
        ctx.addIssue({
          code: "custom",
          message: "Дата окончания должна быть позже даты начала",
          path: ["endContract"],
        });
      }
    }
  });
