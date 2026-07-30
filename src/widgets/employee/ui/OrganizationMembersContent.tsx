import { getEmployeesByOrgId } from "@/entities/employee"
import { EmployeeCard } from "@/widgets/employee/ui/EmployeeCard"

export const OrganizationMembersContent = async ({
  organizationId,
}: {
  organizationId: string
}) => {
  const employees = await getEmployeesByOrgId(organizationId)

  if (employees.length === 0) {
    return (
      <div className="hidden flex-col items-center justify-center py-12 text-center md:flex">
        <p className="text-muted-foreground text-sm">В организации пока нет сотрудников</p>
      </div>
    )
  }

  return (
    <div className="hidden w-full grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4 md:grid">
      {employees.map((emp) => (
        <EmployeeCard employee={emp} key={emp.id} />
      ))}
    </div>
  )
}

export const OrganizationMembersContentMobile = async ({
  organizationId,
}: {
  organizationId: string
}) => {
  const employees = await getEmployeesByOrgId(organizationId)

  if (employees.length === 0) {
    return (
      <div className="flex nd:hidden flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground text-sm">В организации пока нет сотрудников</p>
      </div>
    )
  }

  return (
    <div className="grid min-w-72 gap-2 p-3 md:hidden">
      {employees.map((emp) => {
        return <EmployeeCard employee={emp} key={emp.id} />
      })}
    </div>
  )
}
