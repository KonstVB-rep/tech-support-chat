"use client";

import {
  FormSchemaOrganizationType,
  formSchemaOrganization,
} from "@/entities/organization";
import { ActionState } from "@/shared/lib/types";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { FieldGroup } from "@/shared/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addOrganizationAction } from "../actions/add";
import { OrganizationForm } from "./OrganizationForm";

const defValues = {
  name: "",
  legalAddress: "",
  actualAddress: "",
  inn: "",
  contractNumber: "",
  timeSupportFrom: "",
  timeSupportTo: "",
  contractStart: "",
  contractEnd: "",
};

export const AddOrganizationDialog = () => {
  const initialState: ActionState = {
    success: false,
    message: null,
    error: null,
  };
  const [state, formAction, isPending] = useActionState(
    addOrganizationAction,
    initialState,
  );

  const form = useForm<FormSchemaOrganizationType>({
    resolver: zodResolver(formSchemaOrganization),
    defaultValues: defValues,
  });

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleFormAction = async (formData: FormData) => {
    const isValid = await form.trigger();
    if (!isValid) return;

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Добавить организацию"
          className="m-0"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg m-0">
        <DialogHeader>
          <DialogTitle className="sr-only">Добавить организацию</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <OrganizationForm
            form={form}
            formAction={handleFormAction}
            isPending={false}
            title="Добавить организацию"
          />
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
};
