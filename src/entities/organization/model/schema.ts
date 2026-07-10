import * as z from "zod";

export const formSchemaOrganization = z
  .object({
    name: z.string().min(2, "Название должно содержать не менее 2 символов."),

    legalAddress: z
      .string()
      .min(2, "Адрес должен содержать не менее 2 символов."),

    actualAddress: z.string().optional(),

    inn: z
      .string()
      .regex(/^\d{10}$|^\d{12}$/, "ИНН должен содержать ровно 10 или 12 цифр"),

    contractNumber: z
      .string()
      .min(3, "Номер договора должен содержать не менее 3 символов."),

    timeSupportFrom: z.string().min(1, "Укажите время начала"),
    timeSupportTo: z.string().min(1, "Укажите время окончания"),

    contractStart: z.string().min(1, "Укажите дату начала"),

    contractEnd: z.string().min(1, "Укажите дату окончания"),
  })
  .superRefine((data, ctx) => {
    if (data.contractStart && data.contractEnd) {
      const start = new Date(data.contractStart);
      const end = new Date(data.contractEnd);

      if (end <= start) {
        ctx.addIssue({
          code: "custom",
          message: "Дата окончания должна быть позже даты начала",
          path: ["contractEnd"],
        });
      }
    }
  });

export type FormSchemaOrganizationType = z.infer<typeof formSchemaOrganization>;
