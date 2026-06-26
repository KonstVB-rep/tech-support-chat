import { DataTable } from "@/shared/ui/custom/DataTable"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"
import { OrganizationsTable } from "@/widgets/organizations-table"

const CompaniesPage = () => {
  return (
      <div className="flex flex-col w-full h-full">
        <WrapperHeaderScreen>Клиенты</WrapperHeaderScreen>
        <div className='overflow-y-auto space-y-10'>
            <OrganizationsTable />
        </div>
     </div>
  )
}

export default CompaniesPage