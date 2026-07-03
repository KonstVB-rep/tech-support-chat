"use server";

import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { Organization } from "@prisma/client";

export const getUserOrganization = async (): Promise<Organization | null> => {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  console.log(session.user.email, "session.user.email");

  const profile = await prisma.profile.findFirst({
    where: {
      email: session.user.email,
    },
  });

  if (!profile) {
    throw new Error("Профиль не найден");
  }

  const member = await prisma.organizationMember.findFirst({
    where: { profileId: profile.id },
    include: { organization: true },
  });
  if (!member) {
    return null;
  }

  return member.organization;
};
