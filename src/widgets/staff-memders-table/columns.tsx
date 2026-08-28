"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import type { StaffMemberWithProfile } from "@/entities/staff-member"
import { DeleteStaffMemberDialog } from "@/features/manage-staff"
import { UpdateStaffMemberForm } from "@/features/manage-staff/ui/UpdateStaffMemberForm"
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle"
import { Button } from "@/shared/ui/components/button"
import { Checkbox } from "@/shared/ui/components/checkbox"
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent"

export const columns: ColumnDef<StaffMemberWithProfile>[] = [
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
    maxSize: 80,
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
      const staffMember = row.original

      return (
        <DrawerComponent
          className="px-3"
          side="right"
          trigger={
            <Button size="icon" variant="ghost">
              <span className="sr-only">Открыть меню</span>
              <Eye className="h-4 w-4" />
            </Button>
          }
        >
          <UpdateStaffMemberForm staffMember={staffMember} />
          <PushSettingsToggle
            isStaffMember={false}
            isViewedByAdmin={true}
            profileId={staffMember.profileId}
            pushEnabled={staffMember.profile.pushEnabled}
            source="admin-staff"
          />
          <DeleteStaffMemberDialog
            staffMemberIds={staffMember.id}
            staffMemberName={staffMember.profile?.name}
          />
        </DrawerComponent>
      )
    },
    size: 80,
    maxSize: 80,
  },
]
