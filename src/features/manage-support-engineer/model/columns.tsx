"use client"

import type { User } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { DeleteSupportEngineerDialog } from "@/features/manage-support-engineer/ui"
import { Button } from "@/shared/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/components/dropdown-menu"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Имя",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Создан",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return new Intl.DateTimeFormat("ru-RU").format(date)
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const engineer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Действия</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => {
                e.preventDefault()
              }}
            >
              <DeleteSupportEngineerDialog engineerIds={engineer.id} engineerName={engineer.name} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
