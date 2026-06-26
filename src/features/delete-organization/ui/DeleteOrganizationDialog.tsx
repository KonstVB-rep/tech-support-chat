"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { useDeleteOrganization } from "../api/useDeleteOrganization";

interface Props {
  ids: string | string[];
  organizationName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteOrganizationDialog = ({
  ids,
  organizationName,
  open,
  onOpenChange,
}: Props) => {
  const mutation = useDeleteOrganization();
  
  const idsArray = Array.isArray(ids) ? ids : [ids];
  const isMultiple = idsArray.length > 1;
  
  const title = isMultiple
    ? `Удалить ${idsArray.length} организаций?`
    : `Удалить организацию "${organizationName}"?`;
    
  const description = isMultiple
    ? "Это действие нельзя отменить. Все связанные данные будут удалены."
    : "Это действие нельзя отменить. Все связанные данные (чаты, сотрудники) будут удалены.";

  const handleDelete = () => {
    mutation.mutate(ids, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={mutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {mutation.isPending ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};