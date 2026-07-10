import { getUserOrganization } from "@/entities/organization/api/getUserOrganization";
import { getCurrentUser } from "@/shared/lib/server-current-user";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { redirect } from "next/navigation";
import { OrganizationCard } from "./ui/OrganizationCard";
import Profile from './ui/Profile';
import { getUserOrganizations } from "@/entities/organization/api/getUserOrganizations";

export const AccountClient = async () => {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");
    
  const organizations = await getUserOrganizations();
  return (
    <div className="flex flex-col w-full h-full">
      <WrapperHeaderScreen><h2 className="text-center font-semibold uppercase w-full">Аккаунт</h2></WrapperHeaderScreen>
      <div className="overflow-y-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
          <Profile />
          {organizations.length > 0 && (
            <div className="space-y-4 max-h-[calc(100vh-60px)] overflow-y-auto p-3">
              {organizations.map((org) => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
