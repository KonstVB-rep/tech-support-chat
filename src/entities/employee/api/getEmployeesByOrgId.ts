"use server";

import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { OrgRole } from "@prisma/client";
import { cacheTag } from "next/cache";
import { EmployeeWithProfile } from "../model";

export const fetchEmployeesByOrgId = async (orgId: string) => {
  "use cache";
  cacheTag(`employees-${orgId}`);
  if (!orgId) return null;
  return await prisma.organizationMember.findMany({
    where: {
      organizationId: orgId,
      profile: {
        user: {
          isActive: true,
        },
      },
    },
    include: {
      profile: {
        include: {
          user: {
            select: {
              email: true,
              role: true,
              isActive: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};

export const getEmployeesByOrgId = async (
  orgId: string,
): Promise<EmployeeWithProfile[]> => {
  const session = await getSession();
  if (!session?.user) throw new Error("Не авторизован");

  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!organization) {
    throw new Error("Организация не найдена");
  }

  // 1. Сначала проверяем, является ли текущий юзер ответственным (RESPONSIBLE) в ЭТОЙ компании
  const isResponsible = await prisma.organizationMember.findFirst({
    where: {
      organizationId: orgId,
      role: OrgRole.RESPONSIBLE,
      profile: {
        userId: session.user.id,
      },
    },
  });

  // 2. Глобальный админ Better Auth
  const isGlobalAdmin = session.user.role === "admin";

  // 🎯 ОГРАНИЧЕНИЕ ДОСТУПА: Если ты НЕ админ И ты НЕ ответственный за эту фирму — Forbidden!
  if (!isGlobalAdmin && !isResponsible) {
    throw new Error(
      "Forbidden: Недостаточно прав для просмотра списка сотрудников",
    );
  }

  // Если ты либо админ, либо законный RESPONSIBLE — база Beget отдает данные
  const employees = await fetchEmployeesByOrgId(orgId);

  return employees ?? [];
};
