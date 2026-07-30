// src/features/manage-support-engineer/ui/CreateSupportEngineerForm.tsx
"use client"
import { useActionState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  type SupportEngineerFormValues,
  supportEngineerFormSchema,
} from "@/entities/support-engineer"
import type { ActionState } from "@/shared/lib/types"
import { addSupportEngineerAction } from "../actions/add"
import { SupportEngineerForm } from "./SupportEngineerForm"

const VALUES_FORM_DEFAULT = {
  email: "",
  name: "",
  password: "",
  phone: "",
}

export const AddSupportEngineerForm = ({ submitText = "Добавить" }: { submitText?: string }) => {
  const initialState: ActionState = {
    success: false,
    message: null,
    error: null,
  }
  const [state, formAction, isPending] = useActionState(addSupportEngineerAction, initialState)

  const form = useForm<SupportEngineerFormValues>({
    resolver: zodResolver(supportEngineerFormSchema),
    defaultValues: VALUES_FORM_DEFAULT,
  })

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message)
      form.reset()
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, form])

  return (
    <SupportEngineerForm
      form={form}
      formAction={formAction}
      isPending={isPending}
      submitText={submitText}
    />
  )
}
