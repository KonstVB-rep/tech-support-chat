"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  getRowClassName?: (row: TData) => string
  actionsButtonsFixed?: (dataIds: string[], resetSelection: () => void) => React.ReactNode
  className?: string
  colsHidden?: string[]
}

export const DataTable = <TData extends { id: string }, TValue>({
  columns,
  data,
  getRowClassName,
  actionsButtonsFixed,
  className,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState<string>("")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnVisibility: {
        role: false,
      },
      globalFilter,
      rowSelection,
    },
    defaultColumn: {
      maxSize: 800,
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const selectedIds = selectedRows
    .map((row: Row<TData>) => row.original?.id as string)
    .filter(Boolean)

  const hasSelection = selectedIds.length > 0
  const resetSelection = () => {
    table.resetRowSelection()
  }

  return (
    <>
      <div className="flex h-full w-full flex-col gap-2 p-2">
        <div className="flex w-full shrink-0 flex-wrap items-center justify-between gap-2 px-2">
          <div className="flex items-center py-2">
            <Input
              className="max-w-sm"
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Поиск..."
              value={globalFilter as string}
            />
          </div>
          <div className="text-muted-foreground text-sm">
            Выбрано {table.getFilteredSelectedRowModel().rows.length} из{" "}
            {table.getFilteredRowModel().rows.length} строк
          </div>
        </div>
        <div
          className={cn(
            "relative min-h-0 w-full flex-1 overflow-auto rounded-md border",
            className,
          )}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 border-border/60 border-b bg-zinc-300 shadow-xl dark:bg-zinc-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  className="bg-zinc-300 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-800"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="whitespace-break-spaces p-2 text-center"
                        key={header.id}
                        style={{
                          width: header.getSize(),
                          minWidth: header.column.columnDef.minSize,
                          maxWidth: header.column.columnDef.maxSize,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className={cn("bg-card", getRowClassName?.(row.original))}
                    data-state={row.getIsSelected() && "selected"}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="whitespace-break-spaces text-center"
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth: cell.column.columnDef.maxSize,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center" colSpan={columns.length}>
                    Нет данных
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {hasSelection && actionsButtonsFixed?.(selectedIds, resetSelection)}
    </>
  )
}
