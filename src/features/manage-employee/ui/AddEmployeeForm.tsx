"use client";

import { EmployeeForm } from "@/features/manage-employee/ui/EmployeeForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";

import { employeeFormSchema, EmployeeFormValues } from "@/entities/employee";
import { ActionState } from "@/shared/lib/types";
import { addEmployeeAction } from "../actions/add";

interface AddEmployeeFormProps {
  organizationId: string;
}

const initialState: ActionState = {
  success: false,
  message: null,
  error: null,
};

export const AddEmployeeForm = ({ organizationId }: AddEmployeeFormProps) => {
  const [state, formAction, isPending] = useActionState(
    addEmployeeAction,
    initialState,
  );

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      position: "",
      role: "MEMBER",
    },
  });

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      form.reset();
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleFormAction = async (formData: FormData) => {
    const isValid = await form.trigger();
    if (!isValid) return;

    formData.append("organizationId", organizationId);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <EmployeeForm
      formAction={handleFormAction}
      form={form}
      isPending={isPending}
    />
  );
};
