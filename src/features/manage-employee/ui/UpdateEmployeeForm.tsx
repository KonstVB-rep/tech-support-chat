"use client";

import { employeeFormSchema, EmployeeFormValues, EmployeeWithProfile } from "@/entities/employee";
import { EmployeeForm } from "@/features/manage-employee/ui/EmployeeForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateEmployeeAction } from "../actions/update";
import { ActionState } from "@/shared/lib/types";


interface UpdateEmployeeFormProps {
  employee: EmployeeWithProfile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const initialState: ActionState = { success: false, message: null, error: null };

export const UpdateEmployeeForm = ({
  employee,
  onSuccess,
  onCancel,
}: UpdateEmployeeFormProps) => {

    const [state, formAction, isPending] = useActionState(updateEmployeeAction, initialState);
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
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
            position: employee.position ?? "",
            phone: employee.profile.phone ?? "",
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
        })
    };

  return (
    <EmployeeForm
      formAction={handleFormAction} form={form} isPending={isPending}/>
  );
};