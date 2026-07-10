import { getEmployeesByOrgId } from "@/entities/employee/api";
import { getOrganization } from "@/entities/organization/api/getOrganization";
import { AddEmployeeDialog } from "@/features/manage-employee";
import { OrganizationDetails } from "@/features/manage-organization";
import Loader from "@/shared/ui/custom/Loader";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import EmployessTable from "@/widgets/employees-table/EmployeesTable";
import { notFound } from "next/navigation";
import { Suspense } from "react";


const OrganizationContent = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {

  const { id } = await params;
  const organization = await getOrganization(id);
  const employees = await getEmployeesByOrgId(id);
  
  if (!organization) {
    notFound();
  }

  return (
  <div className="flex flex-col items-center w-full h-screen overflow-hidden">
  <WrapperHeaderScreen><h2 className="text-center font-semibold uppercase w-full">Компания</h2></WrapperHeaderScreen>
  
  <div className="p-4 flex items-start justify-between w-full">
    <AddEmployeeDialog organizationId={id} />
  </div>

  <div className="flex gap-3 flex-wrap w-full flex-1 overflow-auto px-4 pb-4">
    <div className="w-full flex-1 bg-primary-foreground rounded-2xl">
      <div className="sticky top-0 self-start p-2">
        <OrganizationDetails data={organization} />
      </div>
    </div>

    <div className="w-full flex-2 bg-primary-foreground rounded-2xl">
      <EmployessTable data={employees} />
    </div>
    
  </div>
</div>
  );
};


const OrganizationPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {

  return (
    <div className="flex flex-col items-center w-full h-full">
      <Suspense fallback={<Loader />}>
        <OrganizationContent params={params}/>
      </Suspense>
    </div>
  );
}

export default OrganizationPage;
