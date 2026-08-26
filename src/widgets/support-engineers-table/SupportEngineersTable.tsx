"use client"

import type { SupportEngineerWithProfile } from "@/entities/support-engineer"
import { DeleteSupportEngineerDialog } from "@/features/manage-support-engineer"
import { DataTable } from "@/shared/ui/custom/DataTable"
import FixedWrapper from "@/shared/ui/custom/FixedWrapper"
import { columns } from "./columns"

export const SupportEngineersTable = ({ data }: { data: SupportEngineerWithProfile[] }) => {
  return (
    <div className="hidden h-full w-full overflow-y-auto rounded-xl border border-border/40 bg-background/50 pb-20 md:block">
      <DataTable
        actionsButtonsFixed={(dataIds: string[], resetSelection: () => void) => (
          <FixedWrapper>
            <DeleteSupportEngineerDialog engineerIds={dataIds} onAfterDelete={resetSelection} />
          </FixedWrapper>
        )}
        columns={columns}
        data={data}
      />
    </div>
  )
}
