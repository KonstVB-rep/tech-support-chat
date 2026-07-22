import { getEmployeesByOrgId } from "@/entities/employee";
import { EmployeesTable } from "@/widgets/employees-table";

export const OrganizationMembersContent = async ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const employees = await getEmployeesByOrgId(organizationId);
  return <EmployeesTable data={employees} />;
};
