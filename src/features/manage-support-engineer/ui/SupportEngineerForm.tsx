"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm";
import InputPassword from "@/shared/ui/custom/InputPassword";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Controller, type FieldValues, Path, UseFormReturn } from "react-hook-form";

type SupportEngineerFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formAction: (data: FormData) => void;
  isPending?: boolean;
  submitText?: string;
};

export const SupportEngineerForm = <T extends FieldValues>({
  form,
  formAction,
  isPending = false,
  submitText = "Сохранить",
}: SupportEngineerFormProps<T>) => {
  
  return (
    <Card className="w-full max-w-lg min-w-2xs h-fit bg-transparent shadow-none ring-0">
      <form id="support-engineer-form" action={formAction}>
        <CardContent>
            <FieldGroup>
              <Controller
                name={"email" as Path<T>}
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
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name={"name" as Path<T>}
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
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
              name={"password" as Path<T>}
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
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            <ButtonSubmitForm  title="Сохранить"  text="Сохранение..." form="support-engineer-form"/>
          </Field>
        </CardFooter>
      </form>
    </Card>
  );
};