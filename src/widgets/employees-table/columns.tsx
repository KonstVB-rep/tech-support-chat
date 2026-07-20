"use client";

import { EmployeeWithProfile } from "@/entities/employee";

import {
  DeleteEmployeeDialog,
  UpdateEmployee,
} from "@/features/manage-employee";
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import { DataTableColumnHeader } from "@/shared/ui/data-table-column-header";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

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
      <DataTableColumnHeader
        className="justify-center"
        column={column}
        title="Имя"
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("name") as string;
      return <div className="text-center font-medium">{value}</div>;
    },
    accessorFn: (row: EmployeeWithProfile) => row.profile.name,
  },
  {
    id: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-center"
        column={column}
        title="Email"
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("email") as string;
      return <div className="text-center font-medium">{value}</div>;
    },
    accessorFn: (row: EmployeeWithProfile) => row.profile.email,
  },
  {
    id: "phone",
    header: () => <div className="text-center uppercase text-sm">Телефон</div>,

    cell: ({ row }) => {
      const value = row.getValue("phone") as string;
      return (
        <div className={cn("text-center font-medium")}>{value ?? "—"}</div>
      );
    },
    accessorFn: (row: EmployeeWithProfile) => row.profile.phone,
    minSize: 130,
  },
  {
    id: "position",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-center"
        column={column}
        title="Должность"
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("position") as string;
      return <div className="text-center font-medium">{value}</div>;
    },
    accessorFn: (row: EmployeeWithProfile) => row.position,
  },
  {
    id: "actions",
    maxSize: 80,
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <DrawerComponent
          trigger={
            <Button variant="ghost" size="icon">
              <span className="sr-only">Открыть меню</span>
              <Eye className="h-4 w-4" />
            </Button>
          }
          side="right"
        >
          <div className="no-scrollbar overflow-y-auto p-4 flex flex-col gap-3 h-full overflow-hidden">
            <UpdateEmployee employee={employee} />
            <PushSettingsToggle
              profileId={employee.profileId}
              isSupportEngineer={false}
              pushEnabled={employee.profile.pushEnabled}
              isViewedByAdmin={false}
              source="organization"
              organizationId={employee.organizationId}
            />
            <DeleteEmployeeDialog
              ids={employee.id}
              employeeName={employee.profile.name}
              organizationId={employee.organizationId}
            />
          </div>
        </DrawerComponent>
      );
    },
  },
];
