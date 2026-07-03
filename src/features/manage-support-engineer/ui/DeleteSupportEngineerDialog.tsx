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
  engineerId: string;
  engineerName: string;
  engineerEmail: string;
}

export const DeleteSupportEngineerDialog = ({
  engineerId,
  engineerName,
  engineerEmail,
}: DeleteSupportEngineerDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const [isPending, startDeleteTransition] = useTransition();

  const handleDelete = () => {
    startDeleteTransition(async () => {
      const res = await deleteSupportEngineerAction(engineerId);

      if (res.success) {
        toast.success(`Доступ для инженера ${engineerName} успешно заблокирован`);
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
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 shrink-0"
          title="Деактивировать инженера"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Заблокировать аккаунт инженера?</DialogTitle>
          <DialogDescription>
            Сотрудник <span className="font-semibold text-foreground">{engineerName}</span> ({engineerEmail}) больше не сможет войти в PWA-приложение, а все его активные сессии будут мгновенно аннулированы. 
            <span className="text-muted-foreground text-xs block">
              *История отправленных им сообщений в чатах объектов будет полностью сохранена.
            </span>
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