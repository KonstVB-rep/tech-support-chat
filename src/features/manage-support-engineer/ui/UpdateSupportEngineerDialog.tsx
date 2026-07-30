// src/features/manage-support-engineer/ui/UpdateSupportEngineerDialog.tsx
"use client"
import { useState } from "react"
import { Pencil } from "lucide-react"
import type { SupportEngineerWithProfile } from "@/entities/support-engineer"
import { Button } from "@/shared/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/components/dialog"
import { UpdateSupportEngineerForm } from "./UpdateSupportEngineerForm"

export const UpdateSupportEngineerDialog = ({
  engineer,
}: {
  engineer: SupportEngineerWithProfile
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-start gap-2"
          title="Редактировать инженера"
          variant="ghost"
        >
          <Pencil className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
          Редактировать
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Редактировать инженера</DialogTitle>
          <DialogDescription>Измените данные инженера {engineer.profile?.name}</DialogDescription>
        </DialogHeader>

        <UpdateSupportEngineerForm engineer={engineer} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
