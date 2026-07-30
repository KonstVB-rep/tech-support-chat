// src/app/(pages)/admin/organizations/page.tsx
import { Suspense } from "react"
import { getOrganizations } from "@/entities/organization"
import { AddOrganizationDialog } from "@/features/manage-organization"
import ButtonBack from "@/shared/ui/custom/ButtonBack"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"
import { OrganizationsTable } from "@/widgets/organizations-table"
import OrganizationListMobile from "@/widgets/organizations-table/OrganizationListMobile"

const OrganizationsTableLoader = async () => {
  const organizations = await getOrganizations()
  return (
    <div className="wrapper">
      <OrganizationsTable data={organizations} />
      <OrganizationListMobile organizations={organizations} />
    </div>
  )
}

const OrganizationsPage = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <WrapperHeaderScreen>
        <ButtonBack />
        <h2 className="w-full text-center font-semibold uppercase">Клиенты</h2>
      </WrapperHeaderScreen>

      <div className="h-full w-full space-y-10">
        <div className="m-0 flex w-full justify-start p-2">
          <AddOrganizationDialog />
        </div>

        <Suspense
          fallback={
            <div className="animate-pulse p-4 text-muted-foreground text-sm">
              Загрузка списка клиентов...
            </div>
          }
        >
          <OrganizationsTableLoader />
        </Suspense>
      </div>
    </div>
  )
}

export default OrganizationsPage
