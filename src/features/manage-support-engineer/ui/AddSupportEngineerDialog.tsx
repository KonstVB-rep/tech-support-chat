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
import { AddSupportEngineerForm } from "./AddSupportEngineerForm"

export const AddSupportEngineerDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" title="Добавить инженера" variant="outline">
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Добавить инженера техподдержки</DialogTitle>
          <DialogDescription>Создайте аккаунт нового инженера поддержки</DialogDescription>
        </DialogHeader>

        <AddSupportEngineerForm />
      </DialogContent>
    </Dialog>
  )
}
