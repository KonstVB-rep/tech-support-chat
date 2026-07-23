// src/app/(pages)/user-organizations/page.tsx
import { Suspense } from "react";
import { getProfile } from "@/entities/profile/api/getProfile";
import { getCurrentUser } from "@/shared/lib/server-current-user";
import { OrganizationList } from "./ui/OrganizationList";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";

const UserOrganizationsPage = () => {
  return (
    <div className="w-full">
      <WrapperHeaderScreen>
        <h2 className="text-center font-semibold uppercase flex-1">
          Карточка организации
        </h2>
      </WrapperHeaderScreen>

      <Suspense fallback={<OrganizationListSkeleton />}>
        <UserOrganizationsContent />
      </Suspense>
    </div>
  );
};

async function UserOrganizationsContent() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getProfile(user.id);

  return (
    <OrganizationList organizations={profile?.organizationMembers ?? []} />
  );
}

function OrganizationListSkeleton() {
  return (
    <div className="space-y-3 max-h-1/2 min-h-full overflow-y-auto p-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 rounded-xl bg-muted" />
      ))}
    </div>
  );
}

export default UserOrganizationsPage;
