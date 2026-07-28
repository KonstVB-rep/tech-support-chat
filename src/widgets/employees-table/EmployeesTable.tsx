"use client";

import { EmployeeWithProfile } from "@/entities/employee";
import { DataTable } from "@/shared/ui/custom/DataTable";
import FixedWrapper from "@/shared/ui/custom/FixedWrapper";
import { OrgRole } from "@prisma/client";
import { columns } from "./columns";
import { DeleteEmployeeDialog } from "@/features/manage-employee";

const EmployessTable = ({
  data,
  className,
}: {
  data: EmployeeWithProfile[];
  className?: string;
}) => {
  return (
    <div className="w-full h-full border border-border/40 rounded-xl bg-background/50 overflow-y-auto hidden md:block">
      <DataTable
        columns={columns}
        data={data}
        className={className}
        getRowClassName={(row) =>
          row.role === OrgRole.RESPONSIBLE
            ? "dark:bg-[#575555] bg-[#dcdcdc]"
            : ""
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
