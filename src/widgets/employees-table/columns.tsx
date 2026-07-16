"use client";  

import { EmployeeWithProfile } from "@/entities/employee";

import {  DeleteEmployeeDialog, UpdateEmployee, UpdateEmployeeDialog } from "@/features/manage-employee";
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import { DataTableColumnHeader } from "@/shared/ui/data-table-column-header";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<EmployeeWithProfile, unknown>[] = [
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
      <DataTableColumnHeader className="justify-center" column={column} title="Имя" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("name") as string;
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
      const value = row.getValue("email") as string;
      return <div className="text-center font-medium">{value}</div>
    },
    accessorFn: (row: EmployeeWithProfile) => row.profile.email,
  },
  {
    id: "phone",
    header: () => <div className="text-center uppercase text-sm">Телефон</div>,

    cell: ({ row }) => {
      const value = row.getValue("phone") as string;
      return (
        <div className={cn("text-center font-medium")}>
          {value ?? "—"}
        </div>
      );
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
      const value = row.getValue("position") as string;
      return <div className="text-center font-medium">{value}</div>
    },
    accessorFn: (row: EmployeeWithProfile) => row.position,
  },
  // {
  //   id: "role",
  //   header: () => <div className="text-center uppercase text-sm">Роль</div>,
  //   cell: ({ row }) => {
  //     const value = row.getValue("role") as OrgRole;
  //     return <div className="text-center font-medium">{value}</div>
  //   },
  //   accessorFn: (row: EmployeeWithProfile) => row.role,
  // },
  {
    id: "actions",
    maxSize: 80,
    cell: ({ row }) => {
      const employee = row.original;
 
      return (
            <DrawerComponent buttonTriggerInnerContent={<>
              <span className="sr-only">Открыть меню</span>
              <Eye className="h-4 w-4" />
              </>} side="right">
                  <UpdateEmployee
                          employee={employee}
                        />
                <PushSettingsToggle profileId={employee.profileId} isSupportEngineer={false} pushEnabled={employee.profile.pushEnabled} isViewedByAdmin={false} />
                <DeleteEmployeeDialog ids={employee.id} employeeName={employee.profile.name} organizationId={employee.organizationId} />
            </DrawerComponent>
      )
    },
  },
]