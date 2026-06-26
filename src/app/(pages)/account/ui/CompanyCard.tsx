"use client"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { CalendarComponent } from "@/shared/ui/custom/CalendarComponent"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { Controller, Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"


const formSchema = z.object({
  title: z.string().min(2, "Название должно содержать не менее 2 символов."),
  address: z.string().min(2, "Адрес должен содержать не менее 2 символов."),
  
  inn: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string()
      .regex(/^\d{10,12}$/, "ИНН должен содержать только цифры")
      .refine((val) => !val || val.length === 10 || val.length === 12, {
        message: "ИНН должен содержать 10 или 12 цифр",
      })
      .nullable()
      .optional(),
  ),
  
  contractNumber: z.string().min(3, "Номер договора должен содержать не менее 3 символов."),
  
  startContract: z.preprocess(
    (val) => {
      if (val instanceof Date) return val.toISOString();
      if (!val) return "";
      return val;
    },
    z.string().min(1, "Укажите дату начала"),
  ),
  
  endContract: z.preprocess(
    (val) => {
      if (val instanceof Date) return val.toISOString();
      if (!val) return "";
      return val;
    },
    z.string().min(1, "Укажите дату окончания"),
  ),
}).superRefine((data, ctx) => {

  const now = new Date();
  now.setHours(0, 0, 0, 0); 

  if (data.startContract) {
    const start = new Date(data.startContract);
    if (start < now) {
      ctx.addIssue({
        code: "custom",
        message: "Дата начала не может быть в прошлом",
        path: ["startContract"],
      });
    }
  }
  if (data.startContract && data.endContract) {
    const start = new Date(data.startContract);
    const end = new Date(data.endContract);

    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        message: "Дата окончания должна быть позже даты начала",
        path: ["endContract"],
      });
    }
  }
});

const CompanyCard = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      title: "",
      address: "",
      inn: "",
      contractNumber: "",
      startContract: "",
      endContract: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
  }

  return (

    <Card className="w-full mx-auto max-w-lg min-w-2xs h-fit bg-transparent shadow-none ring-0">
      <CardHeader>
        <CardTitle className="text-center uppercase">Карточка компании</CardTitle>
        <CardDescription>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">
                    Название
                  </FieldLabel>
                  <Input
                    {...field}
                    id="title"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                    className="field-height"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="address">
                    Адрес
                  </FieldLabel>
                  <Input
                    {...field}
                    id="address"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                    className="field-height"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="inn"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="inn">
                    ИНН
                  </FieldLabel>
                  <Input
                      {...field}
                      value={field.value ?? ""}
                      id="inn"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="field-height"
                    />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="contractNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contractNumber">
                    Номер договора
                  </FieldLabel>
                  <Input
                    {...field}
                    id="contractNumber"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                    autoComplete="off"
                    className="field-height"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            
            <div className="flex gap-2">
                  <Controller
                  name="startContract"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Дата начала договора
                      </FieldLabel>
                      <CalendarComponent
                        field={field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="endContract"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Дата окончания договора
                      </FieldLabel>
                      <CalendarComponent
                        field={field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="border-none bg-transparent">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Сбросить
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Сохранить
          </Button>
        </Field>
      </CardFooter>
    </Card>

  )
}


export default CompanyCard