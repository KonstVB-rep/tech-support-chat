// src/app/(pages)/user-organizations/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProfile } from "@/entities/profile/api/getProfile";
import { getCurrentUser } from "@/shared/lib/server-current-user";
import { OrganizationList } from "./ui/OrganizationList";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { prisma } from "@/prisma/prisma-client";

const UserOrganizationsPage = async () => {
  const user = await getCurrentUser();
  if (!user) return notFound();

  const hasAccess = await checkOrganizationAccess(user.id);
  if (!hasAccess) return notFound();

  return (
    <div className="w-full">
      <WrapperHeaderScreen>
        <h2 className="text-center font-semibold uppercase flex-1">
          Карточка компании
        </h2>
      </WrapperHeaderScreen>

      <Suspense fallback={<OrganizationListSkeleton />}>
        <UserOrganizationsContent userId={user.id} />
      </Suspense>
    </div>
  );
};

async function checkOrganizationAccess(userId: string): Promise<boolean> {
  if (userId) {
    const session = await getCurrentUser();
    if (session?.role?.toLowerCase() === "admin") return true;
  }

  const membership = await prisma.organizationMember.findFirst({
    where: {
      profile: { userId },
      role: "RESPONSIBLE",
    },
    select: { id: true },
  });

  return !!membership;
}

async function UserOrganizationsContent({ userId }: { userId: string }) {
  const profile = await getProfile(userId);

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
