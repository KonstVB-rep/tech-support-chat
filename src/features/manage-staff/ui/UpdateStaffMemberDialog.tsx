// src/features/manage-staff/ui/UpdateStaffMemberDialog.tsx
"use client"
import { useState } from "react"
import { Pencil } from "lucide-react"
import type { StaffMemberWithProfile } from "@/entities/staff-member"
import { Button } from "@/shared/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/components/dialog"
import { UpdateStaffMemberForm } from "./UpdateStaffMemberForm"

export const UpdateStaffMemberDialog = ({
  staffMember,
}: {
  staffMember: StaffMemberWithProfile
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-start gap-2"
          title="Редактировать пользователя"
          variant="ghost"
        >
          <Pencil className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
          Редактировать
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Редактировать пользователя</DialogTitle>
          <DialogDescription>
            Измените данные пользователя {staffMember.profile?.name}
          </DialogDescription>
        </DialogHeader>

        <UpdateStaffMemberForm onSuccess={() => setOpen(false)} staffMember={staffMember} />
      </DialogContent>
    </Dialog>
  )
}
