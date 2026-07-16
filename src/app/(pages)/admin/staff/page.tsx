import { getSupportEngineers } from "@/entities/support-engineer";
import { AddSupportEngineerDialog } from "@/features/manage-support-engineer/ui/AddSupportEngineerDialog";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { SupportEngineersTable } from "@/widgets/support-engineers-table";
import { Suspense } from "react";

export default function SupportEngineersPage() {
  return (
    <div className="space-y-3 w-full h-full">
      <WrapperHeaderScreen>
        <h2 className="text-center font-semibold uppercase w-full">
          Инженеры техподдержки
        </h2>
      </WrapperHeaderScreen>

      <div className="grid gap-2 p-2">
        <AddSupportEngineerDialog />

        <Suspense fallback={<SupportEngineersTableSkeleton />}>
          <SupportEngineersList />
        </Suspense>
      </div>
    </div>
  );
}


const SupportEngineersList = async () => {
  const engineers = await getSupportEngineers();
  return <SupportEngineersTable data={engineers} />;
};


const SupportEngineersTableSkeleton = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  );
};