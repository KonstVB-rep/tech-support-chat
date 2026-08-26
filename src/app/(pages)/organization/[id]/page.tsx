//src/app/organization/[id]/page.tsx

import { Suspense } from "react"
import { OrganizationContent } from "@/app/(pages)/organization/[id]/ui/OrganizationContent"
import LoaderCircle from "@/shared/ui/custom/LoaderCircle"

const OrganizationPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div className="flex h-full w-full flex-col items-center">
      <Suspense fallback={<LoaderCircle />}>
        <OrganizationContent params={params} />
      </Suspense>
    </div>
  )
}

export default OrganizationPage
