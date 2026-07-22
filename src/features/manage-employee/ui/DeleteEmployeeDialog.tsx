"use client";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { deleteEmployeeAction } from "../actions/delete";
import { Trash } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface DeleteOrgDialogProps {
  ids: string[] | string;
  organizationId: string;
  employeeName?: string;
  onAfterDelete?: () => void;
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
}

export const DeleteEmployeeDialog = ({
  ids,
  organizationId,
  employeeName,
  onAfterDelete,
  justify = "center",
}: DeleteOrgDialogProps) => {
  const [isPending, startDeleteTransition] = useTransition();

  const [open, setOpen] = useState(false);

  const idsArray = Array.isArray(ids) ? ids : [ids];
  const isMultiple = idsArray.length > 1;

  const title = isMultiple
    ? `Удалить ${idsArray.length} сотрудников?`
    : employeeName
      ? `Удалить сотрудника "${employeeName}"?`
      : "Удалить выбранного сотрудника?";

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    startDeleteTransition(async () => {
      const res = await deleteEmployeeAction(ids, organizationId);

      if (res.success) {
        toast.success(
          isMultiple
            ? `Успешно удалено сотрудников: ${res.deletedCount}`
            : `${employeeName} успешно удалена из системы`,
        );
        onAfterDelete && onAfterDelete();
        setOpen(false);
      } else {
        toast.error(res.error || "Ошибка при удалении");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className={cn(
            "w-full text-primary py-3 flex items-center gap-2 field-height",
            justify,
          )}
        >
          <Trash className="w-4 h-4" />
          Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя отменить.Вы уверены?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            {isPending ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
