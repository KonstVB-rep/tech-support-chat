// src/app/(pages)/admin/organizations/page.tsx
import { Suspense } from "react";
import { getOrganizations } from "@/entities/organization";
import { OrganizationsTable } from "@/widgets/organizations-table";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { AddOrganizationDialog } from "@/features/manage-organization";
import OrganizationListMobile from "@/widgets/organizations-table/OrganizationListMobile";

const OrganizationsTableLoader = async () => {
  const organizations = await getOrganizations();
  return (
    <div className="wrapper">
      <OrganizationsTable data={organizations} />
      <OrganizationListMobile organizations={organizations} />
    </div>
  );
};

const OrganizationsPage = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <WrapperHeaderScreen>
        <h2 className="text-center font-semibold uppercase w-full">Клиенты</h2>
      </WrapperHeaderScreen>

      <div className="space-y-10 w-full h-full">
        <div className="flex justify-start w-full p-2 m-0">
          <AddOrganizationDialog />
        </div>

        <Suspense
          fallback={
            <div className="text-sm text-muted-foreground p-4 animate-pulse">
              Загрузка списка клиентов...
            </div>
          }
        >
          <OrganizationsTableLoader />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationsPage;
