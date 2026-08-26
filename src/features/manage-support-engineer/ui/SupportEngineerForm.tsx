"use client"

import { Controller, type FieldValues, type Path, type UseFormReturn } from "react-hook-form"
import { Button } from "@/shared/ui/components/button"
import { Card, CardContent, CardFooter } from "@/shared/ui/components/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/components/field"
import { Input } from "@/shared/ui/components/input"
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm"
import InputPassword from "@/shared/ui/custom/InputPassword"
import InputPhoneForm from "@/shared/ui/custom/InputPhoneForm"

type SupportEngineerFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  formAction: (data: FormData) => void
  isPending?: boolean
  submitText?: string
}

export const SupportEngineerForm = <T extends FieldValues>({
  form,
  formAction,
  isPending,
  submitText = "Сохранить",
}: SupportEngineerFormProps<T>) => {
  return (
    <Card className="h-fit w-full min-w-2xs bg-transparent shadow-none ring-0">
      <form action={formAction} id="support-engineer-form">
        <CardContent>
          <FieldGroup>
            <Controller
              control={form.control}
              name={"email" as Path<T>}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    className="field-height"
                    id="email"
                    placeholder="engineer@support.ru"
                    type="email"
                    value={String(field.value ?? "")}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name={"name" as Path<T>}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Имя</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    className="field-height"
                    id="name"
                    value={String(field.value ?? "")}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name={"password" as Path<T>}
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

            <InputPhoneForm
              control={form.control}
              errorMessage={
                form.formState.errors.phone?.message
                  ? String(form.formState.errors.phone.message)
                  : undefined
              }
              label="Телефон"
              name={"phone" as Path<T>}
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
            <ButtonSubmitForm
              form="support-engineer-form"
              text="Сохранение..."
              title={submitText}
            />
          </Field>
        </CardFooter>
      </form>
    </Card>
  )
}
