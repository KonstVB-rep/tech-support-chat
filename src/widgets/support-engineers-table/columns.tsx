"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DeleteSupportEngineerDialog, UpdateSupportEngineerDialog } from "@/features/manage-support-engineer";
import { SupportEngineerWithProfile } from "@/entities/support-engineer";
import { DeleteOrganizationDialog } from "@/features/manage-organization";
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenu } from "@/shared/ui/dropdown-menu";
import { organization } from "better-auth/plugins";
import { MoreHorizontal, Link } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";



export const columns: ColumnDef<SupportEngineerWithProfile>[] = [
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
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
    maxSize: 80
  },
  {
    accessorKey: "name",
    header: "Имя",
    cell: ({ row }) => row.original.profile?.name ?? "—",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.profile?.email ?? "—",
  },
  {
    id: "phone",
    header: "Телефон",
    cell: ({ row }) => row.original.profile?.phone ?? "—",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const engineer = row.original;

      return (

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel></DropdownMenuLabel>
            <DropdownMenuItem asChild>
                      <DeleteSupportEngineerDialog
                        engineerIds={engineer.id}
                        engineerName={engineer.profile?.name}
                      />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <UpdateSupportEngineerDialog engineer={engineer} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    maxSize: 80
  },
];