import { getEmployeesByOrgId } from "@/entities/employee";
import { EmployeeCard } from "@/widgets/employee/ui/EmployeeCard";

export const OrganizationMembersContent = async ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const employees = await getEmployeesByOrgId(organizationId);

  if (employees.length === 0) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">
          В организации пока нет сотрудников
        </p>
      </div>
    );
  }

  return (
    <div className="hidden md:grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4 w-full">
      {employees.map((emp) => (
        <EmployeeCard key={emp.id} employee={emp} />
      ))}
    </div>
  );
};

export const OrganizationMembersContentMobile = async ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const employees = await getEmployeesByOrgId(organizationId);

  if (employees.length === 0) {
    return (
      <div className="flex nd:hidden flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">
          В организации пока нет сотрудников
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2 p-3 min-w-72 md:hidden">
      {employees.map((emp) => {
        return <EmployeeCard key={emp.id} employee={emp} />;
      })}
    </div>
  );
};
