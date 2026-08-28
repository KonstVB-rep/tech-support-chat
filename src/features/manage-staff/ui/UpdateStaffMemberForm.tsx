// src/features/manage-staff/ui/UpdateStaffMemberForm.tsx
"use client"

import { startTransition, useActionState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Profile } from "@prisma/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  type StaffMemberWithProfile,
  type UpdateStaffMemberFormValues,
  updateStaffMemberSchema,
} from "@/entities/staff-member"
import { USER_ROLE } from "@/shared/constants"
import type { ActionState } from "@/shared/lib/types"
import { updateStaffMemberAction } from "../actions/update"
import { StaffMemberForm } from "./StaffMemberForm"

interface UpdateStaffMemberFormProps {
  staffMember: StaffMemberWithProfile
  onSuccess?: () => void
  submitText?: string
}

export const UpdateStaffMemberForm = ({
  staffMember,
  onSuccess,
  submitText = "Сохранить",
}: UpdateStaffMemberFormProps) => {
  const initialState: ActionState & { data?: Profile & { user: { role: string } } } = {
    success: false,
    message: null,
    error: null,
  }

  const [state, formAction, isPending] = useActionState(updateStaffMemberAction, initialState)

  const form = useForm<UpdateStaffMemberFormValues>({
    resolver: zodResolver(updateStaffMemberSchema),
    defaultValues: {
      email: staffMember.profile?.email ?? "",
      name: staffMember.profile?.name ?? "",
      password: "",
      phone: staffMember.profile?.phone ?? "",
      role: staffMember.profile.user.role === USER_ROLE.ADMIN,
    },
  })

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message)
      form.setValue("password", "")
      form.setValue("email", state.data?.email ?? "")
      form.setValue("name", state.data?.name ?? "")
      form.setValue("phone", state.data?.phone ?? "")
      form.setValue("role", state.data?.user.role === USER_ROLE.ADMIN)
      onSuccess?.()
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, onSuccess, form])

  const handleFormAction = async (formData: FormData) => {
    const roleValue = form.getValues("role")

    formData.append("role", roleValue ? "true" : "false")
    const isValid = await form.trigger()
    if (!isValid) return

    formData.append("id", staffMember.id)
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
