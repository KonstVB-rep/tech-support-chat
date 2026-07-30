"use client"
import { Clock2Icon } from "lucide-react"
import { Controller, type UseFormReturn } from "react-hook-form"
import type { FormSchemaOrganizationType } from "@/entities/organization"
import { Button } from "@/shared/ui/components/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/components/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/components/field"
import { Input } from "@/shared/ui/components/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/components/input-group"
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm"
import { CalendarComponent } from "@/shared/ui/custom/CalendarComponent"

type OrganizationFormProps = {
  form: UseFormReturn<FormSchemaOrganizationType>
  formAction: (formData: FormData) => void
  isPending: boolean
  title: string
}

export const OrganizationForm = ({ form, formAction, isPending, title }: OrganizationFormProps) => {
  return (
    <div className="flex h-full w-full select-none items-start justify-center">
      <Card className="h-fit w-full min-w-2xs max-w-lg bg-transparent shadow-none ring-0">
        <form action={formAction} id="organization-form">
          <CardHeader>
            <CardTitle className="font-semibold text-base">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Название</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="field-height"
                      id="name"
                      placeholder=""
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="legalAddress"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="legalAddress">Юридический адрес</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="field-height"
                      id="legalAddress"
                      placeholder=""
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="actualAddress"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="actualAddress">Фактический адрес</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="field-height"
                      id="actualAddress"
                      placeholder=""
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="inn"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="inn">ИНН</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="field-height"
                      id="inn"
                      value={field.value ?? ""}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="contractNumber"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="contractNumber">Номер договора</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      className="field-height"
                      id="contractNumber"
                      placeholder=""
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="flex gap-2">
                <Controller
                  control={form.control}
                  name="timeSupportFrom"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="time-from"></FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          id="time-from"
                          step="1"
                          type="time"
                        />
                        <InputGroupAddon>
                          <Clock2Icon className="text-muted-foreground" />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="timeSupportTo"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="time-to"></FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          id="time-to"
                          step="1"
                          type="time"
                        />
                        <InputGroupAddon>
                          <Clock2Icon className="text-muted-foreground" />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Controller
                  control={form.control}
                  name="contractStart"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Дата начала договора</FieldLabel>
                      <CalendarComponent aria-invalid={fieldState.invalid} field={field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="contractEnd"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Дата окончания договора</FieldLabel>
                      <CalendarComponent aria-invalid={fieldState.invalid} field={field} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </CardContent>
          <CardFooter className="border-none bg-transparent p-2">
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
                disabled={isPending}
                form="organization-form"
                text="Сохранение..."
                title="Сохранить"
              />
            </Field>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
