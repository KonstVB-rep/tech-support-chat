"use client";

import { SupportEngineerFormValues } from "@/entities/support-engineer";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm";
import InputPassword from "@/shared/ui/custom/InputPassword";
import InputPhoneForm from "@/shared/ui/custom/InputPhoneForm";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import {
  Controller,
  type FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

type SupportEngineerFormProps = {
  form: UseFormReturn<SupportEngineerFormValues>;
  formAction: (data: FormData) => void;
  isPending?: boolean;
  submitText?: string;
};

export const SupportEngineerForm = ({
  form,
  formAction,
  isPending = false,
  submitText = "Сохранить",
}: SupportEngineerFormProps) => {
  return (
    <Card className="w-full min-w-2xs h-fit bg-transparent shadow-none ring-0">
      <form id="support-engineer-form" action={formAction}>
        <CardContent>
          <FieldGroup>
            <Controller
              name={"email"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    value={String(field.value ?? "")}
                    id="email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder="engineer@support.ru"
                    className="field-height"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name={"name"}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Имя</FieldLabel>
                  <Input
                    {...field}
                    value={String(field.value ?? "")}
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
              name={"password"}
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

            <InputPhoneForm<SupportEngineerFormValues> // 1. Явно передаем тип формы в дженерик инпута
              name="phone"
              label="Telephone"
              control={form.control}
              // 2. Оборачиваем в String(), чтобы гарантировать тип string для TS
              errorMessage={
                form.formState.errors.phone?.message
                  ? String(form.formState.errors.phone.message)
                  : undefined
              }
            />

            {/* <Controller
              name={"phone" as Path<T>}
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="phone">Телефон</FieldLabel>
                  <Input
                    {...field}
                    value={String(field.value ?? "")}
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
            <ButtonSubmitForm
              title="Сохранить"
              text="Сохранение..."
              form="support-engineer-form"
            />
          </Field>
        </CardFooter>
      </form>
    </Card>
  );
};
