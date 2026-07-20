"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Input } from "@/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowClassName?: (row: TData) => string;
  actionsButtonsFixed?: (
    dataIds: string[],
    resetSelection: () => void,
  ) => React.ReactNode;
  className?: string;
  colsHidden?:string[]
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  getRowClassName,
  actionsButtonsFixed,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");

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
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const selectedIds = selectedRows
    .map((row: Row<TData>) => row.original?.id as string)
    .filter(Boolean);

  const hasSelection = selectedIds.length > 0;
  const resetSelection = () => {
    table.resetRowSelection();
  };

  return (
    <>
      <div className="space-y-2 w-full p-2">
        <div className="flex items-center justify-between gap-2 flex-wrap w-full px-2">
          <div className="flex items-center py-2">
            <Input
              placeholder="Поиск..."
              value={globalFilter as string}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Выбрано {table.getFilteredSelectedRowModel().rows.length} из{" "}
            {table.getFilteredRowModel().rows.length} строк
          </div>
        </div>
        <div
          className={cn(
            "overflow-y-auto rounded-md border w-full h-full relative",
            className,
          )}
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-zinc-300 dark:bg-zinc-800 border-b border-border/60 shadow-xl">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="whitespace-break-spaces text-center p-2"
                        style={{
                          width: header.getSize(),
                          minWidth: header.column.columnDef.minSize,
                          maxWidth: header.column.columnDef.maxSize,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn("bg-card", getRowClassName?.(row.original))}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="whitespace-break-spaces text-center"
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth: cell.column.columnDef.maxSize,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
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
  );
}
