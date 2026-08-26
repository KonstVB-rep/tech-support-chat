"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import type { EmployeeWithProfile } from "@/entities/employee"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/components/button"
import { Checkbox } from "@/shared/ui/components/checkbox"
import { DataTableColumnHeader } from "@/shared/ui/components/data-table-column-header"
import EmployeeActionsMenu from "@/widgets/employee/ui/EmployeeActionsMenu"

export const columns: ColumnDef<EmployeeWithProfile, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-center" column={column} title="Имя" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("name") as string
      return <div className="text-center font-medium">{value}</div>
    },
    accessorFn: (row: EmployeeWithProfile) => row.profile.name,
  },
  {
    id: "email",
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-center" column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("email") as string
      return <div className="text-center font-medium">{value}</div>
    },
    accessorFn: (row: EmployeeWithProfile) => row.profile.email,
  },
  {
    id: "phone",
    header: () => <div className="text-center text-sm uppercase">Телефон</div>,

    cell: ({ row }) => {
      const value = row.getValue("phone") as string
      return <div className={cn("text-center font-medium")}>{value ?? "—"}</div>
    },
    accessorFn: (row: EmployeeWithProfile) => row.profile.phone,
    minSize: 130,
  },
  {
    id: "position",
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-center" column={column} title="Должность" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("position") as string
      return <div className="text-center font-medium">{value}</div>
    },
    accessorFn: (row: EmployeeWithProfile) => row.position,
  },
  {
    id: "actions",
    maxSize: 80,
    cell: ({ row }) => {
      const employee = row.original

      return (
        <EmployeeActionsMenu
          data={employee}
          side="right"
          trigger={
            <Button size="icon" variant="ghost">
              <span className="sr-only">Открыть меню</span>
              <Eye className="h-4 w-4" />
            </Button>
          }
        />
      )
    },
  },
]
