"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DeleteSupportEngineerDialog, UpdateSupportEngineerDialog } from "@/features/manage-support-engineer";
import { SupportEngineerWithProfile } from "@/entities/support-engineer";
import { DeleteOrganizationDialog } from "@/features/manage-organization";
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator, DropdownMenu } from "@/shared/ui/dropdown-menu";
import { organization } from "better-auth/plugins";
import { MoreHorizontal, Link } from "lucide-react";
import { Button } from "@/shared/ui/button";



export const columns: ColumnDef<SupportEngineerWithProfile>[] = [
  {
    accessorKey: "name",
    header: "Имя",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "phone",
    header: "Телефон",
    cell: ({ row }) => row.original.profile?.phone ?? "—",
  },
  {
    accessorKey: "createdAt",
    header: "Создан",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return new Intl.DateTimeFormat("ru-RU").format(date);
    },
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
                        engineerId={engineer.id}
                        engineerName={engineer.name}
                        engineerEmail={engineer.email}
                      />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <UpdateSupportEngineerDialog engineer={engineer} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        // <div className="flex justify-end gap-2">
        //   <UpdateSupportEngineerDialog engineer={engineer} />
          // <DeleteSupportEngineerDialog
          //   engineerId={engineer.id}
          //   engineerName={engineer.name}
          //   engineerEmail={engineer.email}
          // />
        // </div>
      );
    },
  },
];