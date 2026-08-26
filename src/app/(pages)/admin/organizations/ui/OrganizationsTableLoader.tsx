import { getOrganizations } from "@/entities/organization"
import { OrganizationsTable } from "@/widgets/organizations-table"
import OrganizationListMobile from "@/widgets/organizations-table/OrganizationListMobile"

export const OrganizationsTableLoader = async () => {
  const organizations = await getOrganizations()
  return (
    <div className="wrapper">
      <OrganizationsTable data={organizations} />
      <OrganizationListMobile organizations={organizations} />
    </div>
  )
}
