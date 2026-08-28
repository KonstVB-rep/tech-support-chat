"use client"

import type { StaffMemberWithProfile } from "@/entities/staff-member"
import { DeleteStaffMemberDialog } from "@/features/manage-staff"
import { DataTable } from "@/shared/ui/custom/DataTable"
import FixedWrapper from "@/shared/ui/custom/FixedWrapper"
import { columns } from "./columns"

export const StaffMembersTable = ({ data }: { data: StaffMemberWithProfile[] }) => {
  return (
    <div className="hidden h-full w-full overflow-y-auto rounded-xl border border-border/40 bg-background/50 pb-20 md:block">
      <DataTable
        actionsButtonsFixed={(dataIds: string[], resetSelection: () => void) => (
          <FixedWrapper>
            <DeleteStaffMemberDialog onAfterDelete={resetSelection} staffMemberIds={dataIds} />
          </FixedWrapper>
        )}
        columns={columns}
        data={data}
      />
    </div>
  )
}
