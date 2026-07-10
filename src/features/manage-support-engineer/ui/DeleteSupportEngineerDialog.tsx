"use client";

import { useState, useTransition } from "react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Trash2 } from "lucide-react";
import { deleteSupportEngineerAction } from "../actions/delete";
import { toast } from "sonner";

type DeleteSupportEngineerDialogProps = {
  engineerIds: string | string[];
  engineerName?: string;
  onAfterDelete?: () => void;
}

export const DeleteSupportEngineerDialog = ({
  engineerIds: ids,
  engineerName,
  onAfterDelete
}: DeleteSupportEngineerDialogProps) => {
  const [isPending, startDeleteTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const idsArray = Array.isArray(ids) ? ids : [ids];
  const isMultiple = idsArray.length > 1;

  const title = isMultiple
    ? `Будут удалены инженероы: ${idsArray.length}?`
    : engineerName 
      ? `Удалить инженера "${engineerName}"?`
      : "Удалить выбранного инженера?";


  const description = isMultiple ? `Выбранные инженеры больше не смогут войти приложение, а все их активные сессии будут мгновенно аннулированы.` : `${engineerName} больше не сможет войти в приложение, а все его активные сессии будут мгновенно аннулированы.`


  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();

    startDeleteTransition(async () => {
      const res = await deleteSupportEngineerAction(ids);

       if (res.success) {
        toast.success(`Инженера ${engineerName} успешно удален`);
        onAfterDelete && onAfterDelete();
        setOpen(false);
      } else {
        toast.error(res.error || "Не удалось отключить аккаунт сотрудника");
      }
    });
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="text-white disabled:opacity-50 shrink-0 w-full text-start"
          title="Деактивировать инженера"
        >
          <Trash2 className="h-4 w-4" /> Удалить
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <span className="font-semibold text-foreground">{description}</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Отменить
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Удаление..." : "Удалить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};