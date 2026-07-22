import { getEmployeesByOrgId } from "@/entities/employee";
import { EmployeesTable } from "@/widgets/employees-table";

export const OrganizationMembersContent = async ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const employees = await getEmployeesByOrgId(organizationId);
  return (
    <EmployeesTable
      data={employees}
      className="max-h-[calc(100vh-25vh)] md:max-h-[calc(100%-90px)]"
    />
  );
};
