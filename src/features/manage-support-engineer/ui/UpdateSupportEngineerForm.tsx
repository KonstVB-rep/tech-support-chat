// src/features/manage-support-engineer/ui/UpdateSupportEngineerForm.tsx
"use client";
import { useActionState, useEffect } from "react";
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

interface UpdateSupportEngineerFormProps {
  engineer: SupportEngineerWithProfile;
  onSuccess?: () => void; // Коллбэк для закрытия модалки
  submitText?: string;
}

export const UpdateSupportEngineerForm = ({
  engineer,
  onSuccess,
  submitText = "Сохранить",
}: UpdateSupportEngineerFormProps) => {
  const initialState: ActionState = { success: false, message: null, error: null };
  const [state, formAction, isPending] = useActionState(updateSupportEngineerAction, initialState);

  const form = useForm<UpdateSupportEngineerFormValues>({
    resolver: zodResolver(updateSupportEngineerSchema), 
    defaultValues: {
      email: engineer.email,
      name: engineer.name,
      password: "",
      phone: engineer.profile?.phone ?? "",
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
    form.reset({
      email: engineer.email,
      name: engineer.name,
      password: "",
      phone: engineer.profile?.phone ?? "",
    });
  }, [engineer, form]);

  const handleFormAction = async (formData: FormData) => {
    const isValid = await form.trigger();
    if (!isValid) return;

    formData.append("id", engineer.id); // 🎯 ЖЕСТКО СВЯЗЫВАЕМ С ID ДЛЯ BETTER AUTH
    formAction(formData);
  };

  return (
    <SupportEngineerForm<UpdateSupportEngineerFormValues>
      form={form}
      formAction={handleFormAction}
      isPending={isPending}
      submitText={submitText}
    />
  );
};
