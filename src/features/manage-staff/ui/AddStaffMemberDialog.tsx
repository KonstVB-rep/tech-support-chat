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
import { AddStaffMemberForm } from "./AddStaffMemberForm"

export const AddStaffMemberDialog = () => {
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
          <DialogDescription>Создайте аккаунт нового сотрудника</DialogDescription>
        </DialogHeader>

        <AddStaffMemberForm />
      </DialogContent>
    </Dialog>
  )
}
