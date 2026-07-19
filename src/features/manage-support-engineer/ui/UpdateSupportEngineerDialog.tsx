// src/features/manage-support-engineer/ui/UpdateSupportEngineerDialog.tsx
"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Pencil } from "lucide-react";
import { UpdateSupportEngineerForm } from "./UpdateSupportEngineerForm";
import { SupportEngineerWithProfile } from "@/entities/support-engineer";

export const UpdateSupportEngineerDialog = ({
  engineer,
}: {
  engineer: SupportEngineerWithProfile;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          title="Редактировать инженера"
          className="flex justify-start items-center gap-2"
        >
          <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          Редактировать
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Редактировать инженера</DialogTitle>
          <DialogDescription>
            Измените данные инженера {engineer.profile?.name}
          </DialogDescription>
        </DialogHeader>

        <UpdateSupportEngineerForm
          engineer={engineer}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
