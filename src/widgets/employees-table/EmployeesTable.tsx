"use client";

import { EmployeeWithProfile } from "@/entities/employee";
import { DataTable } from "@/shared/ui/custom/DataTable";
import FixedWrapper from "@/shared/ui/custom/FixedWrapper";
import { OrgRole } from "@prisma/client";
import { columns } from "./columns";
import { DeleteEmployeeDialog } from "@/features/manage-employee";
// import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

const EmployessTable = ({ data }: { data: EmployeeWithProfile[] }) => {
  // const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div className="w-full h-full border border-border/40 rounded-xl bg-background/50 overflow-y-auto pb-20">
      <DataTable
        columns={columns}
        data={data}
        getRowClassName={(row) =>
          row.role === OrgRole.RESPONSIBLE ? "shadow-[0_0_0_3px_#1e40af]" : ""
        }
        actionsButtonsFixed={(
          dataIds: string[],
          resetSelection: () => void,
        ) => (
          <FixedWrapper>
            <DeleteEmployeeDialog
              ids={dataIds}
              onAfterDelete={resetSelection}
              organizationId={data[0]?.organizationId}
            />
          </FixedWrapper>
        )}
      />
    </div>
  );
};

export default EmployessTable;
