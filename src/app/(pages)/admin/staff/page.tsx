import { Suspense } from "react"
import EngineersDataStream from "@/app/(pages)/admin/staff/ui/EngineersDataStream"
import { AddSupportEngineerDialog } from "@/features/manage-support-engineer"
import ButtonBack from "@/shared/ui/custom/ButtonBack"
import LoaderCircle from "@/shared/ui/custom/LoaderCircle"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"

export default async function SupportEngineersPage() {
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

        <Suspense fallback={<LoaderCircle />}>
          <EngineersDataStream />
        </Suspense>
      </div>
    </div>
  )
}
