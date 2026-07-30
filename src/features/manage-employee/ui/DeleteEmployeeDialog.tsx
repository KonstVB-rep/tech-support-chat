"use client"
import { useState, useTransition } from "react"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
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
} from "@/shared/ui/components/alert-dialog"
import { Button } from "@/shared/ui/components/button"
import { deleteEmployeeAction } from "../actions/delete"

interface DeleteOrgDialogProps {
  ids: string[] | string
  organizationId: string
  employeeName?: string
  onAfterDelete?: () => void
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly"
}

export const DeleteEmployeeDialog = ({
  ids,
  organizationId,
  employeeName,
  onAfterDelete,
  justify = "center",
}: DeleteOrgDialogProps) => {
  const [isPending, startDeleteTransition] = useTransition()

  const [open, setOpen] = useState(false)

  const idsArray = Array.isArray(ids) ? ids : [ids]
  const isMultiple = idsArray.length > 1

  const title = isMultiple
    ? `Удалить ${idsArray.length} сотрудников?`
    : employeeName
      ? `Удалить сотрудника "${employeeName}"?`
      : "Удалить выбранного сотрудника?"

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()

    startDeleteTransition(async () => {
      const res = await deleteEmployeeAction(ids, organizationId)

      if (res.success) {
        toast.success(
          isMultiple
            ? `Успешно удалено сотрудников: ${res.deletedCount}`
            : `${employeeName} успешно удалена из системы`,
        )
        onAfterDelete?.()
        setOpen(false)
      } else {
        toast.error(res.error || "Ошибка при удалении")
      }
    })
  }

  return (
    <AlertDialog onOpenChange={setOpen} open={open}>
      <AlertDialogTrigger asChild>
        <Button
          className={cn("field-height flex w-full items-center gap-2 py-3 text-primary", justify)}
          variant="destructive"
        >
          <Trash className="h-4 w-4" />
          Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>Это действие нельзя отменить.Вы уверены?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 font-medium text-white hover:bg-red-700"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
