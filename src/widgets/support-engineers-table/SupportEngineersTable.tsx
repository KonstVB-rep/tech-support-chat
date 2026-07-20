"use client";

import { DataTable } from "@/shared/ui/custom/DataTable";
import { columns } from "./columns";
import { SupportEngineerWithProfile } from "@/entities/support-engineer";
import FixedWrapper from "@/shared/ui/custom/FixedWrapper";
import { DeleteSupportEngineerDialog } from "@/features/manage-support-engineer";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

export const SupportEngineersTable = ({
  data,
}: {
  data: SupportEngineerWithProfile[];
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) return null;
  return (
    <div className="w-full h-full border border-border/40 rounded-xl bg-background/50 overflow-y-auto pb-20">
      <DataTable
        columns={columns}
        data={data}
        actionsButtonsFixed={(
          dataIds: string[],
          resetSelection: () => void,
        ) => (
          <FixedWrapper>
            <DeleteSupportEngineerDialog
              engineerIds={dataIds}
              onAfterDelete={resetSelection}
            />
          </FixedWrapper>
        )}
      />
    </div>
  );
};
