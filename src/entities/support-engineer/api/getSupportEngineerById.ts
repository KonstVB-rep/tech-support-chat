"use server";

import { prisma } from "@/prisma/prisma-client";
import { USER_ROLE } from "@/shared/constants";
import { getSession } from "@/shared/lib/server-current-user";
import { cacheTag } from "next/cache";
import { redirect } from "next/navigation";

// Оптимизированная серверная функция получения инженера из кэша
const fetchSupportEngineerById = async (id: string) => {
  "use cache";
  cacheTag(`support-engineers-${id}`);

  return await prisma.supportEngineer.findFirst({
    where: {
      id,
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
              id: true,
              name: true,
              email: true,
              role: true,
              isActive: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });
};

export const getSupportEngineerById = async (id: string): Promise<any> => {
  // Поменяй any на свой обновленный тип SupportEngineerWithProfile
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/sign-in?error=unauthorized");
  }

  // 🎯 ИСПРАВЛЕНО: Проверяем права суперадмина через чистую строку Better Auth
  if (session.user.role !== USER_ROLE.ADMIN) {
    redirect("/?error=forbidden");
  }

  const engineer = await fetchSupportEngineerById(id);

  if (!engineer) {
    redirect("/admin/staff?error=not_found");
  }

  return engineer;
};
