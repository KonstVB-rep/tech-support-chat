"use client"

import { Controller, type UseFormReturn } from "react-hook-form"
import type { EmployeeFormValues } from "@/entities/employee"
import { Button } from "@/shared/ui/components/button"
import { Card, CardContent, CardFooter } from "@/shared/ui/components/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/components/field"
import { Input } from "@/shared/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select"
import InputPassword from "@/shared/ui/custom/InputPassword"
import InputPhoneForm from "@/shared/ui/custom/InputPhoneForm"

type EmployeeFormProps = {
  form: UseFormReturn<EmployeeFormValues>
  formAction: (formData: FormData) => void
  isPending?: boolean
  submitText?: string
}

export const EmployeeForm = ({
  form,
  formAction,
  isPending = false,
  submitText = "Сохранить",
}: EmployeeFormProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="h-fit w-full min-w-2xs max-w-3xl bg-transparent shadow-none ring-0">
        <form action={formAction} id="employee-form">
          <CardContent>
            <FieldGroup>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="field-height"
                      id="email"
                      placeholder="example@mail.ru"
                      type="email"
                      value={field.value ?? ""}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Имя</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="field-height"
                      id="name"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="position"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="position">Должность</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="field-height"
                      id="position"
                      placeholder="Разработчик"
                      value={field.value ?? ""}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <InputPhoneForm
                control={form.control}
                errorMessage={form.formState.errors.phone?.message}
                label="Телефон"
                name="phone"
              />

              {/* <Controller
                name="phone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="phone">Телефон</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="phone"
                      type="tel"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      placeholder="+7 (999) 123-45-67"
                      className="field-height"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              /> */}

              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                    <InputPassword
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="field-height"
                      id="password"
                      type="password"
                      value={field.value ?? ""}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Роль</FieldLabel>
                    <Select
                      aria-invalid={fieldState.invalid}
                      name="role"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Сотрудник</SelectItem>
                        <SelectItem value="RESPONSIBLE">Ответственное лицо</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter className="border-none bg-transparent">
            <Field orientation="horizontal">
              <Button
                disabled={isPending}
                onClick={() => form.reset()}
                type="button"
                variant="outline"
              >
                Сбросить
              </Button>
              <Button disabled={isPending} form="employee-form" type="submit">
                {isPending ? "Сохранение..." : submitText}
              </Button>
            </Field>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
