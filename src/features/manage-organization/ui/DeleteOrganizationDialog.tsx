// src/features/manage-organization/ui/DeleteOrganizationDialog.tsx
"use client";
import { useTransition } from "react";
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
import { deleteOrganizationAction } from "../actions/delete";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface DeleteOrgDialogProps {
  ids: string[] | string;
  organizationName?: string; 
  className?: string;
}

export const DeleteOrganizationDialog = ({
  ids,
  organizationName,
  className
}: DeleteOrgDialogProps) => {
  const [isPending, startDeleteTransition] = useTransition();

  const idsArray = Array.isArray(ids) ? ids : [ids];
  const isMultiple = idsArray.length > 1;

  // 🎯 РЕАКТИВНЫЙ ЗАГОЛОВОК: Подстраивается под одиночное или массовое удаление
  const title = isMultiple
    ? `Удалить ${idsArray.length} организаций?`
    : organizationName 
      ? `Удалить организацию "${organizationName}"?`
      : "Удалить выбранную организацию?";

  const description = isMultiple
    ? "Это действие нельзя отменить. Все связанные данные (участники, контракты, чаты объектов) для всех выбранных компаний будут полностью удалены из базы данных Beget."
    : "Это действие нельзя отменить. Все связанные данные этой организации будут полностью стерты без возможности восстановления.";

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    startDeleteTransition(async () => {
      const res = await deleteOrganizationAction(ids);

      if (res.success) {
        toast.success(
          isMultiple 
            ? `Успешно удалено организаций: ${res.deletedCount}` 
            : "Организация успешно удалена из системы"
        );
      } else {
        toast.error(res.error || "Ошибка при удалении");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
         <Button
        variant="destructive"
        size="sm"
        className={cn("text-primary", className)}
      >
        Удалить
      </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Отмена
          </AlertDialogCancel>
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
