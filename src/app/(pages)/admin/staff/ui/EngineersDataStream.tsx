import { getSupportEngineers } from "@/entities/support-engineer"
import EngineerListMobile from "@/entities/support-engineer/ui/EngineerListMobile"
import { SupportEngineersTable } from "@/widgets/support-engineers-table"

const EngineersDataStream = async () => {
  const engineers = await getSupportEngineers()
  return (
    <>
      <div className="hidden h-full w-full md:block">
        <SupportEngineersTable data={engineers} />
      </div>

      <div className="block w-full md:hidden">
        <EngineerListMobile data={engineers} />
      </div>
    </>
  )
}

export default EngineersDataStream
