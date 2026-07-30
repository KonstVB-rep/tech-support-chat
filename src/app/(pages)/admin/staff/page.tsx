import { getSupportEngineers } from "@/entities/support-engineer"
import EngineerListMobile from "@/entities/support-engineer/ui/EngineerListMobile"
import { AddSupportEngineerDialog } from "@/features/manage-support-engineer"
import ButtonBack from "@/shared/ui/custom/ButtonBack"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"
import { SupportEngineersTable } from "@/widgets/support-engineers-table"

export default async function SupportEngineersPage() {
  const engineers = await getSupportEngineers()

  return (
    <div className="h-full w-full space-y-3">
      <WrapperHeaderScreen>
        <div className="flex w-full items-center justify-between px-2">
          <ButtonBack />
          <h2 className="flex-1 text-center font-semibold uppercase">Инженеры техподдержки</h2>
          <div className="w-8 shrink-0" />
        </div>
      </WrapperHeaderScreen>

      <div className="grid w-full gap-2 p-2">
        <AddSupportEngineerDialog />

        <div className="hidden h-full w-full md:block">
          <SupportEngineersTable data={engineers} />
        </div>

        <div className="block w-full md:hidden">
          <EngineerListMobile data={engineers} />
        </div>
      </div>
    </div>
  )
}
