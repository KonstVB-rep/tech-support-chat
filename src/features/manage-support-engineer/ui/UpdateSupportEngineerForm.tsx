// src/features/manage-support-engineer/ui/UpdateSupportEngineerForm.tsx
"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  SupportEngineerWithProfile,
  updateSupportEngineerSchema,
  type UpdateSupportEngineerFormValues,
} from "@/entities/support-engineer";
import { updateSupportEngineerAction } from "../actions/update";
import { SupportEngineerForm } from "./SupportEngineerForm";
import { ActionState } from "@/shared/lib/types";
import { Profile } from "@prisma/client";

interface UpdateSupportEngineerFormProps {
  engineer: SupportEngineerWithProfile;
  onSuccess?: () => void;
  submitText?: string;
}

export const UpdateSupportEngineerForm = ({
  engineer,
  onSuccess,
  submitText = "Сохранить",
}: UpdateSupportEngineerFormProps) => {
  const initialState: ActionState & { data?: Profile } = {
    success: false,
    message: null,
    error: null,
  };

  const [state, formAction, isPending] = useActionState(
    updateSupportEngineerAction,
    initialState,
  );

  const form = useForm<UpdateSupportEngineerFormValues>({
    resolver: zodResolver(updateSupportEngineerSchema),
    defaultValues: {
      email: engineer.profile?.email ?? "",
      name: engineer.profile?.name ?? "",
      password: "",
      phone: engineer.profile?.phone ?? "",
    },
  });

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      form.setValue("password", "");
      form.setValue("email", state.data?.email ?? "");
      form.setValue("name", state.data?.name ?? "");
      form.setValue("phone", state.data?.phone ?? "");
      onSuccess?.();
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state, onSuccess, form]);

  const handleFormAction = async (formData: FormData) => {
    const isValid = await form.trigger();
    if (!isValid) return;

    formData.append("id", engineer.id);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <SupportEngineerForm
      form={form}
      formAction={handleFormAction}
      isPending={isPending}
      submitText={submitText}
    />
  );
};
