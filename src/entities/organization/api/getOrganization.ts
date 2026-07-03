// src/entities/organization/api/getOrganization.ts
"use server";

import { prisma } from "@/prisma/prisma-client";

import { cacheTag } from "next/cache";
import { redirect, notFound } from "next/navigation";
import type { SingleOrganizationWithCounts } from "../model/types";
import { getSession } from "@/shared/lib/server-current-user";
import { USER_ROLE } from "@/shared/constants";

const fetchOrganization = async (
  id: string,
): Promise<SingleOrganizationWithCounts | null> => {
  "use cache";
  cacheTag(`organization-${id}`);

  return prisma.organization.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          members: true,
          chats: true,
        },
      },
    },
  });
};

export const getOrganization = async (
  id: string,
): Promise<SingleOrganizationWithCounts> => {
  if (!id) {
    redirect("/admin/organizations?error=missing_id");
  }

  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/sign-in?error=unauthorized");
  }

  if (session.user.role !== USER_ROLE.ADMIN) {
    redirect("/?error=forbidden");
  }

  const organization = await fetchOrganization(id);

  if (!organization) {
    notFound();
  }

  return organization;
};
