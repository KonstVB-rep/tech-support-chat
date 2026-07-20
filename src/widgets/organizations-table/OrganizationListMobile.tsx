import { OrganizationWithCounts } from "@/entities/organization";
import OrganizationCardMobile from "./OrganizationCardMobile";

type OrganizationsListProps = {
  organizations: OrganizationWithCounts[];
};

const OrganizationListMobile = ({organizations } :OrganizationsListProps) => {
  return (
    <div className="max-h-[77dvh] overflow-y-auto grid gap-4 p-4">{
        organizations.map(org => {
            return (
                <OrganizationCardMobile key={org.id} data={org}/>
            )
        })
        }</div>
  )
}

export default OrganizationListMobile