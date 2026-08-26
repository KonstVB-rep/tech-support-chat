"use client"

import { startTransition, useActionState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type FormSchemaOrganizationType, formSchemaOrganization } from "@/entities/organization"
import type { ActionState } from "@/shared/lib/types"
import { Button } from "@/shared/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/components/dialog"
import { FieldGroup } from "@/shared/ui/components/field"
import { addOrganizationAction } from "../actions/add"
import { OrganizationForm } from "./OrganizationForm"

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
}

export const AddOrganizationDialog = () => {
  const initialState: ActionState = {
    success: false,
    message: null,
    error: null,
  }
  const [state, formAction, _isPending] = useActionState(addOrganizationAction, initialState)

  const form = useForm<FormSchemaOrganizationType>({
    resolver: zodResolver(formSchemaOrganization),
    defaultValues: defValues,
  })

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message)
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  const handleFormAction = async (formData: FormData) => {
    const isValid = await form.trigger()
    if (!isValid) return

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="m-0" size="icon" title="Добавить организацию" variant="outline">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="m-0 sm:max-w-lg">
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
  )
}
