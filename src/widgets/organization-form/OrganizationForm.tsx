
"use client"

import { useUpdateOrganization } from "@/features/update-organization"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card"
import { CalendarComponent } from "@/shared/ui/custom/CalendarComponent"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field"
import { Input } from "@/shared/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Organization } from "@prisma/client"
import { useEffect } from "react"
import { Controller, Resolver, useForm } from "react-hook-form"
import * as z from "zod"
import { formSchema } from "./form-schema"
import { useCurrentUser } from "@/shared/lib/useCurrentUser"


const OrganizationForm = ({organization}: {organization: Organization}) => {

const { role, user, isLoading } = useCurrentUser();;

const mutation = useUpdateOrganization(); 

const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as Resolver<z.infer<typeof formSchema>>,
    defaultValues: {
      name: "",
      legalAddress: "",
      actualAddress: "",
      inn: "",
      contractNumber: "",
      supportHours: "",
      contractStart: "",
      contractEnd: "",
    },
  });

  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name,
        legalAddress: organization.legalAddress,
        actualAddress: organization.actualAddress ?? "",
        inn: organization.inn,
        contractNumber: organization.contractNumber,
        supportHours: organization.supportHours,
        contractStart: Intl.DateTimeFormat("ru").format(new Date(organization.contractStart)),
        contractEnd: Intl.DateTimeFormat("ru").format(new Date(organization.contractEnd)),
      });
    }
  }, [organization, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // ✅ Вызываем Server Action
    mutation.mutate({
      id: organization.id,
      data: {
        ...data,
        contractStart: new Date(data.contractStart),
        contractEnd: new Date(data.contractEnd),
      },
    });
  }

  return (
    <div className="flex flex-col items-center w-full h-full">
     <WrapperHeaderScreen>Компания</WrapperHeaderScreen>
       <div className="flex items-center justify-center w-full h-full">
    <Card className="w-full max-w-lg min-w-2xs h-fit bg-transparent shadow-none ring-0">
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FieldLabel htmlFor="supportHours">
                    Номер договора
                  </FieldLabel>
                  <Input
                    {...field}
                    id="supportHours"
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
    </div>
    </div>
  )
}


export default OrganizationForm