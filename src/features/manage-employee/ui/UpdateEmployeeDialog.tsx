"use client";

import { EmployeeWithProfile } from "@/entities/employee";
import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";
import { Pencil } from "lucide-react";
import { UpdateEmployee } from "./UpdateEmployee";

interface UpdateEmployeeDialogProps {
  employee: EmployeeWithProfile
}

export const UpdateEmployeeDialog = ({ employee }: UpdateEmployeeDialogProps) => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="whitespace-break-spaces w-full flex items-center justify-start gap-2">
          <Pencil className="w-4 h-4" />Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать сотрудника</DialogTitle>
        </DialogHeader>
        <UpdateEmployee
          employee={employee}
        />
      </DialogContent>
    </Dialog>
  );
};