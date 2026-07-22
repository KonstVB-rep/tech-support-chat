"use client";

import {
  EmployeeWithProfile,
  updateEmployeeFormSchema,
  UpdateEmployeeFormValues,
} from "@/entities/employee";
import { USER_ROLE } from "@/shared/constants";
import { useCurrentUser } from "@/shared/lib/hooks/useCurrentUser";
import { ActionState } from "@/shared/lib/types";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { updateEmployeeAction } from "../actions/update";

interface UpdateEmployeeProps {
  employee: EmployeeWithProfile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const initialState: ActionState = {
  success: false,
  message: null,
  error: null,
};

export const UpdateEmployee = ({
  employee,
  onSuccess,
  onCancel,
}: UpdateEmployeeProps) => {
  const [state, formAction, isPending] = useActionState(
    updateEmployeeAction,
    initialState,
  );

  const form = useForm<UpdateEmployeeFormValues>({
    resolver: zodResolver(updateEmployeeFormSchema),
    defaultValues: {
      name: employee.profile.name,
      email: employee.profile.email ?? "",
      phone: employee.profile.phone ?? "",
      position: employee.position ?? "",
      role: employee.role,
    },
  });

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      onSuccess?.();
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state, onSuccess]);

  useEffect(() => {
    if (employee) {
      form.reset({
        email: employee.profile?.email,
        name: employee.profile.name,
        phone: employee.profile.phone ?? "",
        position: employee.position ?? "",
        role: employee.role,
      });
    }
  }, [employee, form]);

  // Перехватываем FormData, чтобы привязать её к ID текущей компании
  const handleFormAction = async (formData: FormData) => {
    const isValid = await form.trigger();
    if (!isValid) return;

    formData.append("employeeId", employee.id);
    formData.append("organizationId", employee.organizationId);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <UpdateEmployeeForm
      formAction={handleFormAction}
      form={form}
      isPending={isPending}
    />
  );
};

type UpdateEmployeeFormProps = {
  form: UseFormReturn<UpdateEmployeeFormValues>;
  formAction: (formData: FormData) => void;
  isPending?: boolean;
  submitText?: string;
};

export const UpdateEmployeeForm = ({
  form,
  formAction,
  isPending = false,
  submitText = "Сохранить",
}: UpdateEmployeeFormProps) => {
  const { role } = useCurrentUser();

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full max-w-3xl min-w-2xs h-fit bg-transparent shadow-none ring-0">
        <form id="employee-form" action={formAction}>
          <CardContent>
            <FieldGroup>
              <div className="grid gap-1">
                <span>Email:</span>
                <span className="field-height flex items-center dark:bg-muted rounded-lg p-2 bg-ring/20">
                  {form.getValues("email")}
                </span>
              </div>

              <div className="grid gap-1">
                <span>Имя:</span>
                <span className="field-height flex items-center bg-muted rounded-lg p-2 bg-ring/20">
                  {form.getValues("name")}
                </span>
              </div>

              <div className="grid gap-1">
                <span>Телефон:</span>
                <span className="field-height flex items-center bg-muted rounded-lg p-2 bg-ring/20">
                  {form.getValues("phone")}
                </span>
              </div>

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

              {role === USER_ROLE.ADMIN && (
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
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          className="field-height"
                        >
                          <SelectValue placeholder="Выберите роль" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MEMBER" className="field-height">
                            Сотрудник
                          </SelectItem>
                          <SelectItem
                            value="RESPONSIBLE"
                            className="field-height"
                          >
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
              )}
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
