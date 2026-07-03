
"use client";
import { type FormSchemaOrganizationType } from "@/entities/organization";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm";
import { CalendarComponent } from "@/shared/ui/custom/CalendarComponent";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Controller, UseFormReturn } from "react-hook-form";

interface OrganizationFormProps {
  form: UseFormReturn<FormSchemaOrganizationType>;
  formAction: (formData: FormData) => void;
  isPending: boolean;
  title: string;
  submitText: string;
}

export const OrganizationForm = ({
  form,
  formAction,
  isPending,
  title,
  submitText,
}: OrganizationFormProps) => {
  return (
    <div className="flex items-start justify-center w-full h-full select-none">
      <Card className="w-full max-w-lg min-w-2xs h-fit bg-transparent shadow-none ring-0">
        <form id="organization-form" action={formAction}>
        <CardHeader>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
      
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">
                      Название
                    </FieldLabel>
                    <Input
                      {...field}
                      id="name"
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
                name="legalAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="legalAddress">
                      Адрес
                    </FieldLabel>
                    <Input
                      {...field}
                      id="legalAddress"
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
                name="actualAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="actualAddress">
                      Адрес
                    </FieldLabel>
                    <Input
                      {...field}
                      id="actualAddress"
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

              <Controller
                name="supportHours"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Время поддержки</FieldLabel>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      name={field.name}
                      className="grid grid-cols-3 gap-2 mt-2"
                    >
                      {[
                        { value: "8", label: "8 часов", desc: "Базовый" },
                        { value: "12", label: "12 часов", desc: "Стандарт" },
                        { value: "24", label: "24 часа", desc: "Премиум" },
                      ].map((option) => (
                        <div key={option.value}>
                          <RadioGroupItem
                            value={option.value}
                            id={`supportHours-${option.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`supportHours-${option.value}`}
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary"
                          >
                            <span className="text-lg font-bold">{option.label}</span>
                            <span className="text-sm text-muted-foreground">{option.desc}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              
              <div className="flex gap-2">
                    <Controller
                    name="contractStart"
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
                    name="contractEnd"
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
        </CardContent>
        <CardFooter className="border-none bg-transparent p-2">
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Сбросить
            </Button>
            <ButtonSubmitForm  title="Сохранить"  text="Сохранение..." disabled={isPending} form="organization-form"/>
          </Field>
        </CardFooter>
        </form>
      </Card>

    </div>
  )
}

