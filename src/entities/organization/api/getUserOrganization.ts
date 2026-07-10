"use server";

import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { Organization } from "@prisma/client";

export const getUserOrganization = async (): Promise<Organization | null> => {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const profileWithOrg = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      organizationMembers: {
        take: 1,
        select: {
          organization: true,
        },
      },
    },
  });

  if (
    !profileWithOrg?.organizationMembers ||
    profileWithOrg.organizationMembers.length === 0
  ) {
    return null;
  }

  return profileWithOrg.organizationMembers[0].organization;
};
