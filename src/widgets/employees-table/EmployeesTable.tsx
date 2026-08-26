"use client"

import { OrgRole } from "@prisma/client"
import type { EmployeeWithProfile } from "@/entities/employee"
import { DeleteEmployeeDialog } from "@/features/manage-employee"
import { DataTable } from "@/shared/ui/custom/DataTable"
import FixedWrapper from "@/shared/ui/custom/FixedWrapper"
import { columns } from "./columns"

const EmployessTable = ({
  data,
  className,
}: {
  data: EmployeeWithProfile[]
  className?: string
}) => {
  return (
    <div className="hidden h-full w-full overflow-y-auto rounded-xl border border-border/40 bg-background/50 md:block">
      <DataTable
        actionsButtonsFixed={(dataIds: string[], resetSelection: () => void) => (
          <FixedWrapper>
            <DeleteEmployeeDialog
              ids={dataIds}
              onAfterDelete={resetSelection}
              organizationId={data[0]?.organizationId}
            />
          </FixedWrapper>
        )}
        className={className}
        columns={columns}
        data={data}
        getRowClassName={(row) =>
          row.role === OrgRole.RESPONSIBLE ? "dark:bg-[#575555] bg-[#dcdcdc]" : ""
        }
      />
    </div>
  )
}

export default EmployessTable
