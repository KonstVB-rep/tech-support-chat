// src/app/(pages)/admin/organizations/page.tsx
import { Suspense } from "react";
import { getOrganizations } from "@/entities/organization";
import { OrganizationsTable } from "@/widgets/organizations-table";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { AddOrganizationDialog } from "@/features/manage-organization";

const OrganizationsTableLoader = async () => {
  const organizations = await getOrganizations();
  return <OrganizationsTable data={organizations} />;
};

const OrganizationsPage = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <WrapperHeaderScreen>Клиенты</WrapperHeaderScreen>
      
      <div className="space-y-10 w-full h-full pt-4">
        <div className="flex justify-end w-full px-2 m-0">
          <AddOrganizationDialog />
        </div>

        <Suspense fallback={<div className="text-sm text-muted-foreground p-4 animate-pulse">Загрузка списка клиентов...</div>}>
          <OrganizationsTableLoader />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationsPage;
