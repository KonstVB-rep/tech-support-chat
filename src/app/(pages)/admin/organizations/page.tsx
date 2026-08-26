// src/app/(pages)/admin/organizations/page.tsx

import { Suspense } from "react"
import { OrganizationsTableLoader } from "@/app/(pages)/admin/organizations/ui/OrganizationsTableLoader"
import { AddOrganizationDialog } from "@/features/manage-organization"
import ButtonBack from "@/shared/ui/custom/ButtonBack"
import LoaderCircle from "@/shared/ui/custom/LoaderCircle"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"

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

        <Suspense fallback={<LoaderCircle />}>
          <OrganizationsTableLoader />
        </Suspense>
      </div>
    </div>
  )
}

export default OrganizationsPage
