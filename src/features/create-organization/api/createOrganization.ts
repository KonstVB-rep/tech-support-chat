"use server";

import { hasOrganizationPermission } from "@/entities/organization/model/permissions";
import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { Organization, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createOrganization = async (data: Organization) => {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  if (
    !hasOrganizationPermission(session.user.role as Role, "organization.create")
  ) {
    throw new Error("Forbidden");
  }

  const org = await prisma.organization.create({ data });

  revalidatePath("/organizations");
  return org;
};
