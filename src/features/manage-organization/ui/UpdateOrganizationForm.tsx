// src/features/manage-organization/ui/UpdateOrganizationForm.tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Схему и типы импортируем из твоей сущности организации
import { formSchemaOrganization, SingleOrganizationWithCounts, type FormSchemaOrganizationType } from "@/entities/organization";
import { ActionState } from "@/shared/lib/types";
import { updateOrganizationAction, } from "../actions/update";
import { OrganizationForm } from "./OrganizationForm";
import { startTransition, useActionState, useEffect } from "react";

interface UpdateOrgFormProps {
  organization: SingleOrganizationWithCounts;
  onSuccess?: () => void;
}

const initialState: ActionState = { success: false, message: null, error: null };

export const UpdateOrganizationForm = ({ organization, onSuccess }: UpdateOrgFormProps) => {
  const [state, formAction, isPending] = useActionState(updateOrganizationAction, initialState);

  const form = useForm<FormSchemaOrganizationType>({
    resolver: zodResolver(formSchemaOrganization),
    defaultValues: {
      name: organization.name,
      legalAddress: organization.legalAddress,
      actualAddress: organization.actualAddress ?? "",
      inn: organization.inn,
      contractNumber: organization.contractNumber,
      timeSupportFrom: organization.timeSupportFrom, 
      timeSupportTo: organization.timeSupportTo,
      contractStart: organization.contractStart ? new Date(organization.contractStart).toISOString().split("T")[0] : "",
      contractEnd: organization.contractEnd ? new Date(organization.contractEnd).toISOString().split("T")[0] : "",
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

  // Перехватываем FormData, чтобы привязать её к ID текущей компании
  const handleFormAction = async (formData: FormData) => {

    const isValid = await form.trigger();
    if (!isValid) return;

    formData.append("id", organization.id); 

    startTransition(() => {
      formAction(formData);
    });

  };

  return (
    <OrganizationForm
      form={form}
      formAction={handleFormAction}
      isPending={isPending}
      title="Редактирование организации"
      submitText="Сохранить изменения"
    />
  );
};
