"use server";

import { prisma } from "@/prisma/prisma-client";

import { hasOrganizationPermission } from "@/entities/organization/model/permissions";

import { Organization, Role } from "@prisma/client";
import { getSession } from "@/shared/lib/server-current-user";
import { updateTag } from "next/cache";

export const updateOrganization = async (id: string, data: Organization) => {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  if (
    !hasOrganizationPermission(session.user.role as Role, "organization.update")
  ) {
    throw new Error("Forbidden");
  }

  const org = await prisma.organization.update({
    where: { id },
    data: {
      ...data,
      contractStart: new Date(data.contractStart),
      contractEnd: new Date(data.contractEnd),
    },
  });

  updateTag("organizations");
  updateTag(`organizations-${id}`);

  return org;
};
