// src/features/manage-organization/ui/DeleteOrganizationDialog.tsx
"use client"
import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
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
import { deleteOrganizationAction } from "../actions/delete"

interface DeleteOrgDialogProps {
  ids: string[] | string
  organizationName?: string
  className?: string
  onAfterDelete?: () => void
}

export const DeleteOrganizationDialog = ({
  ids,
  organizationName,
  className,
  onAfterDelete,
}: DeleteOrgDialogProps) => {
  const [isPending, startDeleteTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const idsArray = Array.isArray(ids) ? ids : [ids]
  const isMultiple = idsArray.length > 1

  const title = isMultiple
    ? `Удалить ${idsArray.length} организаций?`
    : organizationName
      ? `Удалить организацию "${organizationName}"?`
      : "Удалить выбранную организацию?"

  const description = isMultiple
    ? "Это действие нельзя отменить. Все связанные данные (участники, контракты, чаты объектов) для всех выбранных компаний будут полностью удалены из базы данных Beget."
    : "Это действие нельзя отменить. Все связанные данные этой организации будут полностью стерты без возможности восстановления."

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()

    startDeleteTransition(async () => {
      const res = await deleteOrganizationAction(ids)

      if (res.success) {
        toast.success(
          isMultiple
            ? `Успешно удалено организаций: ${res.deletedCount}`
            : "Организация успешно удалена из системы",
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
        <Button className={cn("bg-red-500 text-white", className)} size="sm" variant="destructive">
          <Trash2 className="h-4 w-4" /> Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
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
