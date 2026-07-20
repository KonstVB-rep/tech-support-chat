// src/widgets/organizations-data/ui/OrganizationsTable.tsx
"use client";

import type { OrganizationWithCounts } from "@/entities/organization";
import { DeleteOrganizationDialog } from "@/features/manage-organization";
import { DataTable } from "@/shared/ui/custom/DataTable";
import FixedWrapper from "@/shared/ui/custom/FixedWrapper";
import { columns } from "./columns";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

type OrganizationsTableProps = {
  data: OrganizationWithCounts[];
};

export const OrganizationsTable = ({ data }: OrganizationsTableProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) return null;

  return (
    <div className="w-full h-full border border-border/40 rounded-xl bg-background/50 pb-2">
      <DataTable
        className="max-h-[72dvh] md:max-h-[77dvh] overflow-auto"
        columns={columns}
        colsHidden={[""]}
        data={data}
        actionsButtonsFixed={(
          dataIds: string[],
          resetSelection: () => void,
        ) => (
          <FixedWrapper>
            <DeleteOrganizationDialog
              ids={dataIds}
              onAfterDelete={resetSelection}
            />
          </FixedWrapper>
        )}
      />
    </div>
  );
};
