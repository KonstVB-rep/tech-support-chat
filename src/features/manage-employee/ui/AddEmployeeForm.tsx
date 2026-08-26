"use client"

import { startTransition, useActionState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type EmployeeFormValues, employeeFormSchema } from "@/entities/employee"
import { EmployeeForm } from "@/features/manage-employee/ui/EmployeeForm"
import type { ActionState } from "@/shared/lib/types"
import { addEmployeeAction } from "../actions/add"

interface AddEmployeeFormProps {
  organizationId: string
}

const initialState: ActionState = {
  success: false,
  message: null,
  error: null,
}

export const AddEmployeeForm = ({ organizationId }: AddEmployeeFormProps) => {
  const [state, formAction, isPending] = useActionState(addEmployeeAction, initialState)

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
  })

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message)
      form.reset()
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, form.reset])

  const handleFormAction = async (formData: FormData) => {
    const isValid = await form.trigger()
    if (!isValid) return

    formData.append("organizationId", organizationId)
    startTransition(() => {
      formAction(formData)
    })
  }

  return <EmployeeForm form={form} formAction={handleFormAction} isPending={isPending} />
}
