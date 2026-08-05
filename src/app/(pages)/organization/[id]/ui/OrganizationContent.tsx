import { notFound } from "next/navigation"
import { getEmployeesByOrgId } from "@/entities/employee/api"
import { getOrganization } from "@/entities/organization/api/getOrganization"
import { AddEmployeeDialog } from "@/features/manage-employee"
import { OrganizationDetails } from "@/features/manage-organization"
import ButtonBack from "@/shared/ui/custom/ButtonBack"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"
import EmployessTable from "@/widgets/employees-table/EmployeesTable"

export const OrganizationContent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const organization = await getOrganization(id)
  const employees = await getEmployeesByOrgId(id)

  if (!organization) {
    notFound()
  }

  return (
    <div className="flex h-screen w-full flex-col items-center overflow-hidden">
      <WrapperHeaderScreen>
        <div className="flex w-full items-center justify-between px-2">
          <ButtonBack />
          <h2 className="flex-1 text-center font-semibold uppercase">Компания</h2>
          <div className="w-8 shrink-0" />
        </div>
      </WrapperHeaderScreen>

      <div className="flex w-full items-start justify-between p-4">
        <AddEmployeeDialog organizationId={id} />
      </div>

      <div className="flex w-full flex-1 flex-wrap gap-3 overflow-auto px-4 pb-4">
        <div className="w-full flex-1 rounded-2xl bg-primary-foreground">
          <div className="sticky top-0 self-start p-2">
            <OrganizationDetails data={organization} />
          </div>
        </div>

        <div className="w-full flex-2 rounded-2xl bg-primary-foreground">
          <EmployessTable data={employees} />
        </div>
      </div>
    </div>
  )
}
