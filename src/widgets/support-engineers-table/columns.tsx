"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DeleteSupportEngineerDialog } from "@/features/manage-support-engineer";
import { SupportEngineerWithProfile } from "@/entities/support-engineer";
import { Eye } from "lucide-react";
import { Checkbox } from "@/shared/ui/checkbox";
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle";
import { UpdateSupportEngineerForm } from "@/features/manage-support-engineer/ui/UpdateSupportEngineerForm";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";

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
          <DrawerComponent buttonTriggerInnerContent={<>
            <span className="sr-only">Открыть меню</span>
            <Eye className="h-4 w-4" />
            </>} side="right">
              <UpdateSupportEngineerForm
                        engineer={engineer}
                      />
              <PushSettingsToggle profileId={engineer.profileId} isSupportEngineer={false} pushEnabled={engineer.profile.pushEnabled} isViewedByAdmin={true} />
              <DeleteSupportEngineerDialog
              engineerIds={engineer.id}
              engineerName={engineer.profile?.name}
            />
          </DrawerComponent>
      );
    },
    size: 80,
    maxSize: 80
  },
];