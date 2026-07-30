"use client"

import { Plus } from "lucide-react"
import { Button } from "@/shared/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/components/dialog"
import { AddEmployeeForm } from "./AddEmployeeForm"

interface AddEmployeeDialogProps {
  organizationId: string
}

export const AddEmployeeDialog = ({ organizationId }: AddEmployeeDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" title="Добавить сотрудника" variant="outline">
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Добавить сотрудника</DialogTitle>
          <DialogDescription>Заполните данные нового сотрудника организации</DialogDescription>
        </DialogHeader>

        <AddEmployeeForm organizationId={organizationId} />
      </DialogContent>
    </Dialog>
  )
}
