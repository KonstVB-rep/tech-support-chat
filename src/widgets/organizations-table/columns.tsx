"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import type { DateRange } from "react-day-picker"
import type { OrganizationWithCounts } from "@/entities/organization"
import { DeleteOrganizationDialog } from "@/features/manage-organization"
import { Button } from "@/shared/ui/components/button"
import { Checkbox } from "@/shared/ui/components/checkbox"
import { DataTableColumnHeader } from "@/shared/ui/components/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/components/dropdown-menu"

const startOfDay = (date: Date): Date => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

const endOfDay = (date: Date): Date => {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

export const columns: ColumnDef<OrganizationWithCounts>[] = [
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
    cell: ({ row }) => {
      return (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
    maxSize: 60,
  },
  {
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-center" column={column} title="Название" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("name") as string
      return <div>{value}</div>
    },
    accessorFn: (row: OrganizationWithCounts) => row.name,
  },
  {
    id: "inn",
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-center" column={column} title="ИНН" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("inn") as string
      return <div>{value}</div>
    },
    accessorFn: (row: OrganizationWithCounts) => row.inn,
  },
  {
    id: "description",
    header: () => <div className="text-center text-sm uppercase">Описание</div>,
    cell: ({ row }) => {
      const value = row.getValue("description") as string
      return <div>{value}</div>
    },
    accessorFn: (row: OrganizationWithCounts) => row.description,
  },
  {
    id: "contractNumber",
    header: () => <div className="text-center text-sm uppercase">Номер договора</div>,
    cell: ({ row }) => {
      const value = row.getValue("contractNumber") as string
      return <div>{value}</div>
    },
    accessorFn: (row: OrganizationWithCounts) => row.contractNumber,
  },
  {
    id: "supportTime",
    header: () => <div className="text-center text-sm uppercase">Время поддержки</div>,
    cell: ({ row }) => {
      const from = row.original.timeSupportFrom
      const to = row.original.timeSupportTo

      const formatTime = (timeStr: string) => timeStr.split(":").slice(0, 2).join(":")

      return (
        <div className="mx-auto inline-block rounded-md bg-muted/40 px-2 py-1 text-center font-medium text-xs">
          {formatTime(from)} — {formatTime(to)}
        </div>
      )
    },
  },
  {
    id: "contractStart",
    maxSize: 200,
    header: ({ column }) => (
      <DataTableColumnHeader className="justify-center" column={column} title="Начало договора" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("contractStart")
      if (value instanceof Date) {
        return value.toLocaleDateString("ru-RU")
      }

      if (typeof value === "string") {
        const date = new Date(value)
        if (!Number.isNaN(date.getTime())) {
          return <div>{date.toLocaleDateString("ru-RU")}</div>
        }
        return <div>-</div>
      }

      return <div>-</div>
    },
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId) as Date
      const dateAtStartOfDay = startOfDay(date)

      if (filterValue) {
        const { from, to } = filterValue as DateRange

        if (from && to) {
          const toAtEndOfDay = endOfDay(to)
          return dateAtStartOfDay >= startOfDay(from) && dateAtStartOfDay <= toAtEndOfDay
        }

        if (from) {
          return dateAtStartOfDay >= startOfDay(from)
        }
        if (to) {
          return dateAtStartOfDay <= endOfDay(to)
        }
        return false
      }

      return true
    },
    accessorFn: (row: OrganizationWithCounts) => row.contractStart,
  },
  {
    id: "contractEnd",
    maxSize: 200,
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-center"
        column={column}
        title="Окончание договора"
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("contractEnd")
      if (value instanceof Date) {
        return value.toLocaleDateString("ru-RU")
      }

      if (typeof value === "string") {
        const date = new Date(value)
        if (!Number.isNaN(date.getTime())) {
          return <div>{date.toLocaleDateString("ru-RU")}</div>
        }
        return <div>-</div>
      }

      return <div>-</div>
    },
    filterFn: (row, columnId, filterValue) => {
      const date = row.getValue(columnId) as Date
      const dateAtStartOfDay = startOfDay(date)

      if (filterValue) {
        const { from, to } = filterValue as DateRange

        if (from && to) {
          const toAtEndOfDay = endOfDay(to)
          return dateAtStartOfDay >= startOfDay(from) && dateAtStartOfDay <= toAtEndOfDay
        }

        if (from) {
          return dateAtStartOfDay >= startOfDay(from)
        }
        if (to) {
          return dateAtStartOfDay <= endOfDay(to)
        }
        return false
      }

      return true
    },
    accessorFn: (row: OrganizationWithCounts) => row.contractEnd,
  },
  {
    id: "actions",

    maxSize: 80,

    cell: ({ row }) => {
      const organization = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0" variant="ghost">
              <span className="sr-only">Открыть</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel></DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <DeleteOrganizationDialog
                className="flex w-full items-center justify-start gap-2"
                ids={organization.id}
                organizationName={organization.name}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="flex items-center justify-start gap-2"
                href={`/organization/${organization.id}`}
              >
                <Eye />
                Посмотреть
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
