// src/features/manage-staff/ui/CreateStaffMemberForm.tsx
"use client"
import { startTransition, useActionState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { StaffMemberFormSchema, type StaffMemberFormValues } from "@/entities/staff-member"
import type { ActionState } from "@/shared/lib/types"
import { addStaffMemberAction } from "../actions/add"
import { StaffMemberForm } from "./StaffMemberForm"

const VALUES_FORM_DEFAULT: StaffMemberFormValues = {
  email: "",
  name: "",
  password: "",
  phone: "",
  role: false,
}

export const AddStaffMemberForm = ({ submitText = "Добавить" }: { submitText?: string }) => {
  const initialState: ActionState = {
    success: false,
    message: null,
    error: null,
  }
  const [state, formAction, isPending] = useActionState(addStaffMemberAction, initialState)

  const form = useForm<StaffMemberFormValues>({
    resolver: zodResolver(StaffMemberFormSchema),
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

  const handleFormAction = async (formData: FormData) => {
    const isValid = await form.trigger()
    if (!isValid) return

    const roleValue = form.getValues("role")

    formData.append("role", roleValue ? "true" : "false")
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <StaffMemberForm
      form={form}
      formAction={handleFormAction}
      isPending={isPending}
      submitText={submitText}
    />
  )
}
