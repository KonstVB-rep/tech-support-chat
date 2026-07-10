// src/shared/lib/hooks/useDataTable.ts
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";

interface UseDataTableOptions<TData extends { id: string }> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
}

export const useDataTable = <TData extends { id: string }>({
  data,
  columns,
}: UseDataTableOptions<TData>) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    role: false,
  });

  // Инициализируем таблицу
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility, 
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnVisibility,
    },
    defaultColumn: { maxSize: 800 },
  });

  // Расчет выбранных строк
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = useMemo(() => {
    return selectedRows.map((row) => row.original?.id as string).filter(Boolean);
  }, [selectedRows]);

  const hasSelection = selectedIds.length > 0;
  const selectedCount = selectedIds.length;
  
  const resetSelection = () => {
    table.resetRowSelection();
  };

  if (!isMounted) {
    return {
      table: null,
      sorting, setSorting,
      rowSelection, setRowSelection,
      globalFilter, setGlobalFilter,
      selectedIds: [],
      hasSelection: false,
      selectedCount: 0,
      resetSelection,
      isMounted: false
    };
  }

  return {
    table,
    sorting, setSorting,
    rowSelection, setRowSelection,
    globalFilter, setGlobalFilter,
    selectedIds,
    hasSelection,
    selectedCount,
    resetSelection,
    isMounted: true
  };
};
