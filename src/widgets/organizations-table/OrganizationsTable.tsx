// src/widgets/organizations-data/ui/OrganizationsTable.tsx
"use client"

import type { OrganizationWithCounts } from "@/entities/organization"
import { DeleteOrganizationDialog } from "@/features/manage-organization"
import { DataTable } from "@/shared/ui/custom/DataTable"
import FixedWrapper from "@/shared/ui/custom/FixedWrapper"
import { columns } from "./columns"

type OrganizationsTableProps = {
  data: OrganizationWithCounts[]
}

export const OrganizationsTable = ({ data }: OrganizationsTableProps) => {
  return (
    <div className="hidden h-full w-full rounded-xl border border-border/40 bg-background/50 pb-2 md:block">
      <DataTable
        actionsButtonsFixed={(dataIds: string[], resetSelection: () => void) => (
          <FixedWrapper>
            <DeleteOrganizationDialog
              className="field-hight flex w-full items-center justify-start gap-2"
              ids={dataIds}
              onAfterDelete={resetSelection}
            />
          </FixedWrapper>
        )}
        className="max-h-[72dvh] overflow-auto md:max-h-[77dvh]"
        colsHidden={[""]}
        columns={columns}
        data={data}
      />
    </div>
  )
}
