import { prisma } from "@/prisma/prisma-client";
import { USER_ROLE } from "@/shared/constants";
import { OrgRole } from "@prisma/client";

interface CheckPermissionParams {
  user: { id: string; role: string }; // Текущий залогиненный юзер
  organizationId: string;
  targetEmployeeId?: string; // ID сотрудника, которого хотят изменить/удалить (опционально)
  isDeleteAction?: boolean; // Флаг, что происходит именно удаление/деактивация
}

export const hasEmployeeManagePermission = async ({
  user,
  organizationId,
  targetEmployeeId,
  isDeleteAction = false,
}: CheckPermissionParams): Promise<{
  allowed: boolean;
  error: string | null;
}> => {
  // 1. Глобальный админ портала имеет абсолютные права
  if (user.role === USER_ROLE.ADMIN) return { allowed: true, error: null };

  // 2. Ищем профиль текущего пользователя, чтобы понять его роль в этой компании
  const currentMember = await prisma.organizationMember.findFirst({
    where: {
      organizationId,
      profile: { userId: user.id },
      isActive: true,
    },
  });

  if (!currentMember) {
    return {
      allowed: false,
      error: "Вы не являетесь сотрудником этой организации",
    };
  }

  // 3. СЦЕНАРИЙ: Пользователь редактирует САМ СЕБЯ (свой профиль)
  if (targetEmployeeId && currentMember.id === targetEmployeeId) {
    // Изменить свои данные (имя, телефон) можно всегда
    if (!isDeleteAction) return { allowed: true, error: null };

    // Но если RESPONSIBLE пытается УДАЛИТЬ/ДЕАКТИВИРОВАТЬ сам себя:
    if (currentMember.role === OrgRole.RESPONSIBLE) {
      const otherResponsiblesCount = await prisma.organizationMember.count({
        where: {
          organizationId,
          role: OrgRole.RESPONSIBLE,
          isActive: true,
          id: { not: currentMember.id }, // Ищем всех, кроме него самого
        },
      });

      // Жесткий блок, если он последний управляющий
      if (otherResponsiblesCount === 0) {
        return {
          allowed: false,
          error:
            "Нельзя удалить единственного ответственного сотрудника. Назначьте другого ответственного перед уходом.",
        };
      }
    }

    // Обычный MEMBER себя удалить тоже не может, только попросить RESPONSIBLE
    if (currentMember.role === OrgRole.MEMBER && isDeleteAction) {
      return {
        allowed: false,
        error:
          "Вы не можете самостоятельно покинуть организацию. Обратитесь к администратору.",
      };
    }

    return { allowed: true, error: null };
  }

  // 4. СЦЕНАРИЙ: Управление чужими аккаунтами
  // Только активный RESPONSIBLE может добавлять/удалять/менять чужие профили в компании
  if (currentMember.role !== OrgRole.RESPONSIBLE) {
    return {
      allowed: false,
      error:
        "Недостаточно прав. Изменять команду может только ответственный сотрудник (RESPONSIBLE).",
    };
  }

  return { allowed: true, error: null };
};
