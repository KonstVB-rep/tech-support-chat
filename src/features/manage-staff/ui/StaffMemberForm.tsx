"use client"

import { Controller, type FieldValues, type Path, type UseFormReturn } from "react-hook-form"
import { Button } from "@/shared/ui/components/button"
import { Card, CardContent, CardFooter } from "@/shared/ui/components/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/components/field"
import { Input } from "@/shared/ui/components/input"
import { Switch } from "@/shared/ui/components/switch"
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm"
import InputPassword from "@/shared/ui/custom/InputPassword"
import InputPhoneForm from "@/shared/ui/custom/InputPhoneForm"

type StaffMemberFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  formAction: (data: FormData) => void
  isPending?: boolean
  submitText?: string
}

export const StaffMemberForm = <T extends FieldValues>({
  form,
  formAction,
  isPending,
  submitText = "Сохранить",
}: StaffMemberFormProps<T>) => {
  return (
    <Card className="h-fit w-full min-w-2xs bg-transparent shadow-none ring-0">
      <form action={formAction} id="staff-member-form">
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
                    placeholder="staffMember@support.ru"
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

            <Controller
              control={form.control}
              name={"role" as Path<T>}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={"role"}>
                    {field.value ? "Роль: Администратор" : "Сделать администратором"}
                  </FieldLabel>
                  <Switch
                    checked={field.value}
                    className="data-[size=sm]:h-8 data-[size=sm]:w-16"
                    classNameSwitch="dark:data-checked:bg-[linear-gradient(90deg,#000000, #252627)] data-checked:bg-[linear-gradient(90deg,#000000, #252627)] group-data-[size=sm]/switch:size-6 group-data-[size=sm]/switch:data-checked:translate-x-[calc(150%)] grid place-items-center"
                    disabled={isPending}
                    onCheckedChange={field.onChange}
                    size={"sm"}
                  />
                  {form.formState.errors.role?.message &&
                    String(form.formState.errors.role.message) && (
                      <span className="mt-1 text-red-500 text-xs">
                        {String(form.formState.errors.role.message)}
                      </span>
                    )}
                  {fieldState.invalid &&
                    !form.formState.errors.role?.message &&
                    fieldState.error?.message && (
                      <span className="mt-1 text-destructive text-xs">
                        {String(fieldState.error.message)}
                      </span>
                    )}
                </Field>
              )}
            />
          </FieldGroup>
        </CardContent>

        <CardFooter className="border-none bg-transparent">
          <Field orientation="horizontal">
            <Button
              className="flex-1"
              disabled={isPending}
              onClick={() => form.reset()}
              type="button"
              variant="outline"
            >
              Сбросить
            </Button>
            <ButtonSubmitForm
              className="flex-1"
              form="staff-member-form"
              text="Сохранение..."
              title={submitText}
            />
          </Field>
        </CardFooter>
      </form>
    </Card>
  )
}
