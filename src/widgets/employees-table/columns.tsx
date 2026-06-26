"use client";  

import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox";
import { DataTableColumnHeader } from "@/shared/ui/data-table-column-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu"
import { OrgRole } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

export type Employee = {
    id: string
    name: string
    email: string
    phone: string
    position: string
    role: OrgRole
    createdAt: string
    updatedAt: string
}

export const columns: ColumnDef<Employee, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-center" column={column} title="name" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("name") as string;
      return <div className="text-right font-medium">{value}</div>
    },
    accessorFn: (row: Employee) => row.name,
  },
  {
    id: "email",
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-center" column={column} title="email" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("email") as string;
      return <div className="text-right font-medium">{value}</div>
    },
    accessorFn: (row: Employee) => row.email,
  },
  {
    id: "phone",
    header: () => <div className="text-center uppercase text-sm">Phone</div>,
    cell: ({ row }) => {
      const value = row.getValue("phone") as string;
      return <div className="text-right font-medium">{value}</div>
    },
    accessorFn: (row: Employee) => row.phone,
  },
  {
    id: "position",
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-center" column={column} title="position" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("position") as string;
      return <div className="text-right font-medium">{value}</div>
    },
    accessorFn: (row: Employee) => row.position,
  },
  {
    id: "role",
    header: () => <div className="text-center uppercase text-sm">Role</div>,
    cell: ({ row }) => {
      const value = row.getValue("role") as OrgRole;
      return <div className="text-right font-medium">{value}</div>
    },
    accessorFn: (row: Employee) => row.role,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Удалить
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Посмотреть/Редкатировать</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]