import { getSupportEngineers } from "@/entities/support-engineer";
import EngineerListMobile from "@/entities/support-engineer/ui/EngineerListMobile";
import { AddSupportEngineerDialog } from "@/features/manage-support-engineer";
import ButtonBack from "@/shared/ui/custom/ButtonBack";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { SupportEngineersTable } from "@/widgets/support-engineers-table";
import { Suspense } from "react";

export default function SupportEngineersPage() {
  return (
    <div className="space-y-3 w-full h-full">
      <WrapperHeaderScreen>
        <div className="flex items-center justify-between w-full px-2">
          <ButtonBack />
          <h2 className="text-center font-semibold uppercase flex-1">
            Инженеры техподдержки
          </h2>
          <div className="w-8 shrink-0" />{" "}
        </div>
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
  return (
    <>
      <div className="hidden md:block w-full h-full">
        <SupportEngineersTable data={engineers} />
      </div>

      <div className="block md:hidden w-full">
        <EngineerListMobile data={engineers} />
      </div>
    </>
  );
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
