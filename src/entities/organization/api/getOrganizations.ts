"use server";

import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { Role } from "@prisma/client";
import { cacheTag } from "next/cache";
import { hasOrganizationPermission } from "../model/permissions";

export const fetchOrganizations = async () => {
  "use cache";
  cacheTag("organizations");

  return prisma.organization.findMany({
    include: {
      _count: {
        select: {
          members: true,
          chats: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrganizations = async () => {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  if (
    !hasOrganizationPermission(session.user.role as Role, "organizations.view")
  ) {
    throw new Error("Forbidden");
  }

  return fetchOrganizations();
};
