"use client"

import { startTransition, useActionState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, type UseFormReturn, useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  type EmployeeWithProfile,
  type UpdateEmployeeFormValues,
  updateEmployeeFormSchema,
} from "@/entities/employee"
import { USER_ROLE } from "@/shared/constants"
import { useCurrentUser } from "@/shared/lib/hooks/useCurrentUser"
import type { ActionState } from "@/shared/lib/types"
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
import { updateEmployeeAction } from "../actions/update"

interface UpdateEmployeeProps {
  employee: EmployeeWithProfile
  onSuccess?: () => void
}

const initialState: ActionState = {
  success: false,
  message: null,
  error: null,
}

export const UpdateEmployee = ({ employee, onSuccess }: UpdateEmployeeProps) => {
  const [state, formAction, isPending] = useActionState(updateEmployeeAction, initialState)

  const form = useForm<UpdateEmployeeFormValues>({
    resolver: zodResolver(updateEmployeeFormSchema),
    defaultValues: {
      name: employee.profile.name,
      email: employee.profile.email ?? "",
      phone: employee.profile.phone ?? "",
      position: employee.position ?? "",
      role: employee.role,
    },
  })

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message)
      onSuccess?.()
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, onSuccess])

  useEffect(() => {
    if (employee) {
      form.reset({
        email: employee.profile?.email,
        name: employee.profile.name,
        phone: employee.profile.phone ?? "",
        position: employee.position ?? "",
        role: employee.role,
      })
    }
  }, [employee, form])

  const handleFormAction = async (formData: FormData) => {
    const isValid = await form.trigger()
    if (!isValid) return
    formData.append("name", employee.profile.name)
    formData.append("employeeId", employee.id)
    formData.append("organizationId", employee.organizationId)

    startTransition(() => {
      formAction(formData)
    })
  }

  return <UpdateEmployeeForm form={form} formAction={handleFormAction} isPending={isPending} />
}

type UpdateEmployeeFormProps = {
  form: UseFormReturn<UpdateEmployeeFormValues>
  formAction: (formData: FormData) => void
  isPending?: boolean
  submitText?: string
}

const UpdateEmployeeForm = ({
  form,
  formAction,
  isPending = false,
  submitText = "Сохранить",
}: UpdateEmployeeFormProps) => {
  const { role } = useCurrentUser()

  return (
    <div className="flex w-full items-center justify-center">
      <Card className="h-fit w-full min-w-2xs max-w-3xl bg-transparent shadow-none ring-0">
        <form action={formAction} id="employee-form">
          <CardContent>
            <FieldGroup>
              <div className="grid gap-1">
                <span>Email:</span>
                <span className="field-height flex items-center rounded-lg bg-ring/20 p-2 dark:bg-muted">
                  {form.getValues("email")}
                </span>
              </div>

              <div className="grid gap-1">
                <span>Имя:</span>
                <span className="field-height flex items-center rounded-lg bg-muted bg-ring/20 p-2">
                  {form.getValues("name")}
                </span>
              </div>

              <div className="grid gap-1">
                <span>Телефон:</span>
                <span className="field-height flex items-center rounded-lg bg-muted bg-ring/20 p-2">
                  {form.getValues("phone")}
                </span>
              </div>

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

              {role === USER_ROLE.ADMIN && (
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
                        <SelectTrigger aria-invalid={fieldState.invalid} className="field-height">
                          <SelectValue placeholder="Выберите роль" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem className="field-height" value="MEMBER">
                            Сотрудник
                          </SelectItem>
                          <SelectItem className="field-height" value="RESPONSIBLE">
                            Ответственное лицо
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              )}
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
              <Button className="flex-1" disabled={isPending} form="employee-form" type="submit">
                {isPending ? "Сохранение..." : submitText}
              </Button>
            </Field>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
