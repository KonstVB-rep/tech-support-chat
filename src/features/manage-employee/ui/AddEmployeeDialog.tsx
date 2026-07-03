"use client";

import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";
import { Plus } from "lucide-react";
import { AddEmployeeForm } from "./AddEmployeeForm";

interface AddEmployeeDialogProps {
  organizationId: string;
}

export const AddEmployeeDialog = ({ organizationId }: AddEmployeeDialogProps) => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Добавить сотрудника">
          <Plus />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Добавить сотрудника</DialogTitle>
          <DialogDescription>
            Заполните данные нового сотрудника организации
          </DialogDescription>
        </DialogHeader>

        <AddEmployeeForm
          organizationId={organizationId}
        />
      </DialogContent>
    </Dialog>
  );
};