"use client"

import { Pencil } from "lucide-react"
import type { EmployeeWithProfile } from "@/entities/employee"
import { Button } from "@/shared/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/components/dialog"
import { UpdateEmployee } from "./UpdateEmployee"

interface UpdateEmployeeDialogProps {
  employee: EmployeeWithProfile
}

export const UpdateEmployeeDialog = ({ employee }: UpdateEmployeeDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex w-full items-center justify-start gap-2 whitespace-break-spaces"
          size="sm"
          variant="ghost"
        >
          <Pencil className="h-4 w-4" />
          Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать сотрудника</DialogTitle>
        </DialogHeader>
        <UpdateEmployee employee={employee} />
      </DialogContent>
    </Dialog>
  )
}
