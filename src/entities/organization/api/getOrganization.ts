"use server";
import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";

import { notFound } from "next/navigation";
import { hasOrganizationPermission } from "../model/permissions";
import { Role } from "@prisma/client";
import { cacheTag } from "next/cache";

// ✅ Кэшированная функция принимает session как аргумент
export const fetchOrganization = async (id: string) => {
  "use cache";
  cacheTag(`organization-${id}`); // ← тег для одной организации
  cacheTag("organizations"); // ← общий тег для списка

  if (!id) return null;

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

export const getOrganization = async (id: string) => {
  if (!id) return null;

  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  if (
    !hasOrganizationPermission(session.user.role as Role, "organization.view")
  ) {
    throw new Error("Forbidden");
  }

  const organization = await fetchOrganization(id);

  if (!organization) {
    notFound();
  }

  return organization;
};
