import { getUserOrganization } from "@/entities/organization/api/getUserOrganization";
import { getCurrentUser } from "@/shared/lib/server-current-user";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { redirect } from "next/navigation";
import { OrganizationCard } from "./ui/OrganizationCard";
import Profile from './ui/Profile';

export const AccountClient = async () => {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    
   const organization = await getUserOrganization();
  return (
    <div className="flex flex-col w-full h-full">
      <WrapperHeaderScreen>Аккаунт</WrapperHeaderScreen>
      <div className="overflow-y-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-[2dvh]">
          {organization && <OrganizationCard organization={organization} />}
          <Profile />
        </div>
         {/* { organization && <EmployeesTable data={organization} />} */}
      </div>
    </div>
  );
};
