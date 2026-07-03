"use server";

import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { USER_ROLE } from "@/shared/constants";

const fetchSupportEngineersList = async () => {
  "use cache";
  cacheTag("support-engineers");

  return await prisma.supportEngineer.findMany({
    where: {
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
    // Сортируем инженеров по дате добавления в команду
    orderBy: { createdAt: "desc" },
  });
};

export const getSupportEngineers = async (): Promise<any[]> => { // Поменяй any[] на свой обновленный тип
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/sign-in?error=unauthorized");
  }

  // 🎯 ТУТ ВСЁ ВЕРНО: Используем твою константу USER_ROLE.ADMIN для проверки суперадмина
  if (session.user.role !== USER_ROLE.ADMIN) {
    redirect("/?error=forbidden");
  }

  const engineers = await fetchSupportEngineersList();

  return engineers ?? [];
};
