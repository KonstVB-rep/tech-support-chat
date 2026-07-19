import { OrganizationCard } from "@/app/(pages)/account/ui/OrganizationCard";
import { getOrganizationsByUserIdForAdmin } from "@/entities/organization/api/getUserOrganizations";
import Profile from "@/entities/profile/ui/Profile";
import { ProtectByRole } from "@/shared/lib/ProtectByRole";
import { getCurrentUser } from "@/shared/lib/server-current-user";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { redirect } from "next/navigation";

const EmployeeSinglePage = async ({
  params,
}: {
  params: Promise<{ empId: string }>;
}) => {
  const user = await getCurrentUser();

  if (!user) redirect("/auth/sign-in");

  const { empId } = await params;

  const organizations = await getOrganizationsByUserIdForAdmin(empId);
  return (
    <div className="flex flex-col w-full h-full">
      <WrapperHeaderScreen>
        <h2 className="text-center font-semibold uppercase w-full">
          Сотрудник
        </h2>
      </WrapperHeaderScreen>
      <div className="grid grid-cols-1 gap-4 p-3">
        <Profile id={empId} />
        <ProtectByRole>
          {organizations.length > 0 && (
            <div className="space-y-3 max-h-1/2 min-h-full overflow-y-auto p-3">
              {organizations.map((org) => (
                <OrganizationCard key={org.id} organization={org} />
              ))}
            </div>
          )}
        </ProtectByRole>
      </div>
    </div>
  );
};

export default EmployeeSinglePage;
