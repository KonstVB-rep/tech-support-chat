"use server"; // ← ОБЯЗАТЕЛЬНО ПЕРВАЯ СТРОКА!

import "server-only"; // ← для надёжности

import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { Role } from "@prisma/client";
import { updateTag } from "next/cache";

// ✅ Named export
export const deleteOrganization = async (ids: string[] | string) => {
  const idsArray = Array.isArray(ids) ? ids : [ids];
  const validIds = idsArray.filter((id) => id && id.trim() !== "");

  if (!validIds.length) {
    throw new Error("Не переданы валидные ID для удаления");
  }

  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  if (session.user.role !== Role.ADMIN) {
    throw new Error("Forbidden");
  }

  const result = await prisma.organization.deleteMany({
    where: { id: { in: validIds } },
  });

  validIds.forEach((id) => {
    updateTag(`organization-${id}`);
  });
  updateTag("organizations");

  return { deleted: result.count, ids: validIds };
};
