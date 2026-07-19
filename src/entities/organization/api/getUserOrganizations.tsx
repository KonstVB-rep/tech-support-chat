import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { Organization } from "@prisma/client";

export const getUserOrganizations = async (): Promise<Organization[]> => {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");

  const profileWithOrgs = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      organizationMembers: {
        select: {
          organization: true,
        },
      },
    },
  });

  if (!profileWithOrgs || !profileWithOrgs.organizationMembers) {
    return [];
  }

  return profileWithOrgs.organizationMembers.map((m) => m.organization);
};

export const getOrganizationsByUserIdForAdmin = async (
  targetUserId: string,
): Promise<Organization[]> => {
  // 1. ЖЕСТКАЯ ПРОВЕРКА БЕЗОПАСНОСТИ: Убеждаемся, что зарос делает РЕАЛЬНО админ
  const session = await getSession();

  if (!session?.user || session.user.role.toLowerCase() !== "admin") {
    throw new Error("Доступ запрещен. Требуются права администратора системы.");
  }

  if (!targetUserId) {
    throw new Error("Не передан идентификатор целевого пользователя");
  }

  // 2. Вытягиваем организации целевого юзера напрямую по его userId
  const targetProfile = await prisma.profile.findUnique({
    where: { userId: targetUserId },
    select: {
      organizationMembers: {
        select: {
          organization: true,
        },
      },
    },
  });

  if (!targetProfile || !targetProfile.organizationMembers) {
    return [];
  }

  return targetProfile.organizationMembers.map((m) => m.organization);
};
