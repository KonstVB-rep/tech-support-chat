"use client";

import { EmployeeFormValues } from "@/entities/employee";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import InputPassword from "@/shared/ui/custom/InputPassword";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Controller, UseFormReturn } from "react-hook-form";

interface EmployeeFormProps {
  form: UseFormReturn<EmployeeFormValues>;
  formAction: (formData: FormData) => void;
  isPending?: boolean;
  submitText?: string;
}

export const EmployeeForm = ({
  form,
  formAction,
  isPending = false,
  submitText = "Сохранить",
}: EmployeeFormProps) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Card className="w-full max-w-3xl min-w-2xs h-fit bg-transparent shadow-none ring-0">
        <form id="employee-form" action={formAction}>
          <CardContent>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      placeholder="example@mail.ru"
                      className="field-height"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Имя</FieldLabel>
                    <Input
                      {...field}
                      id="name"
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
                name="position"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="position">Должность</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="position"
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      placeholder="Разработчик"
                      className="field-height"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
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
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                    <InputPassword
                      {...field}
                      value={field.value ?? ""}
                      id="password"
                      type="password"
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
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Роль</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                      name="role"
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Сотрудник</SelectItem>
                        <SelectItem value="RESPONSIBLE">
                          Ответственное лицо
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter className="border-none bg-transparent">
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isPending}
              >
                Сбросить
              </Button>
              <Button type="submit" form="employee-form" disabled={isPending}>
                {isPending ? "Сохранение..." : submitText}
              </Button>
            </Field>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
