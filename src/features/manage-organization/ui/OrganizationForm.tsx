"use client";
import { type FormSchemaOrganizationType } from "@/entities/organization";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import ButtonSubmitForm from "@/shared/ui/custom/ButtonSubmitForm";
import { CalendarComponent } from "@/shared/ui/custom/CalendarComponent";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { Clock2Icon } from "lucide-react";
import { Controller, UseFormReturn } from "react-hook-form";

type OrganizationFormProps = {
  form: UseFormReturn<FormSchemaOrganizationType>;
  formAction: (formData: FormData) => void;
  isPending: boolean;
  title: string;
  submitText: string;
};

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
                    <FieldLabel htmlFor="name">Название</FieldLabel>
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
                      Юридический адрес
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
                      Фактический адрес
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
                    <FieldLabel htmlFor="inn">ИНН</FieldLabel>
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
                  name="timeSupportFrom"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="time-from"></FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="time-from"
                          type="time"
                          step="1"
                          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        <InputGroupAddon>
                          <Clock2Icon className="text-muted-foreground" />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  )}
                />

                <Controller
                  name="timeSupportTo"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="time-to"></FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="time-to"
                          type="time"
                          step="1"
                          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
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
                  name="contractStart"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Дата начала договора</FieldLabel>
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
                      <FieldLabel>Дата окончания договора</FieldLabel>
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
                disabled={isPending}
                form="organization-form"
              />
            </Field>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
