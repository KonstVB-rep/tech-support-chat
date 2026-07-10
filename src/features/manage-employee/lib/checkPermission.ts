// src/features/manage-employee/lib/checkPermission.ts
import { prisma } from "@/prisma/prisma-client";
import { USER_ROLE } from "@/shared/constants";
import { OrgRole } from "@prisma/client";

export type EmployeeActionType = "CREATE" | "UPDATE" | "DELETE";

export const EMPLOYEE_MANAGE_ACTIONS = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
} as const;

interface CheckPermissionParams {
  user: { id: string; role: string };
  organizationId: string;
  targetEmployeeId?: string;
  actionType: EmployeeActionType;
}

export const hasEmployeeManagePermission = async ({
  user,
  organizationId,
  targetEmployeeId,
  actionType,
}: CheckPermissionParams): Promise<{
  allowed: boolean;
  error: string | null;
}> => {
  if (user.role === USER_ROLE.ADMIN) return { allowed: true, error: null };

  // Ищем профиль текущего менеджера, проверяем, что он вообще работает в этой компании
  const currentMember = await prisma.organizationMember.findFirst({
    where: {
      organizationId,
      profile: { userId: user.id },
    },
  });

  if (!currentMember) {
    return {
      allowed: false,
      error: "Вы не являетесь сотрудником этой организации",
    };
  }

  // 3. Жесткий барьер: Если юзер не имеет статус RESPONSIBLE — ему закрыты вообще любые админ-действия
  if (currentMember.role !== OrgRole.RESPONSIBLE) {
    return {
      allowed: false,
      error:
        "Недостаточно прав. Управлять командой может только ответственный сотрудник (RESPONSIBLE).",
    };
  }

  // =========================================================================
  // 🚀 РАЗДЕЛЕНИЕ БИЗНЕС-ЛОГИКИ ПО ТИПАМ ДЕЙСТВИЙ
  // =========================================================================

  // 🟢 СЦЕНАРИЙ А: Добавление нового человека в компанию (CREATE)
  if (actionType === EMPLOYEE_MANAGE_ACTIONS.CREATE) {
    return { allowed: true, error: null };
  }

  // 🔴 СЦЕНАРИЙ Б: Полное удаление/деактивация из компании (DELETE)
  if (actionType === EMPLOYEE_MANAGE_ACTIONS.DELETE) {
    if (!targetEmployeeId) {
      return {
        allowed: false,
        error: "Не указан идентификатор сотрудника для удаления",
      };
    }

    // ❌ ПРАВИЛО 1: Защита от самоудаления. Никто (ни MEMBER, ни RESPONSIBLE) не может удалить сам себя!
    if (currentMember.id === targetEmployeeId) {
      return {
        allowed: false,
        error:
          "Вы не можете самостоятельно удалить свой профиль или покинуть организацию. Обратитесь к суперадминистратору системы.",
      };
    }

    // 🎯 Ищем целевую карточку того, кого этот RESPONSIBLE пытается удалить прямо сейчас
    const targetMember = await prisma.organizationMember.findUnique({
      where: { id: targetEmployeeId },
    });

    if (!targetMember) {
      return {
        allowed: false,
        error: "Удаляемый сотрудник не найден в базе данных",
      };
    }

    // ❌ ПРАВИЛО 2: RESPONSIBLE может удалять только рядовых рабочих (MEMBER).
    // Если он пытается удалить другого RESPONSIBLE — выкатываем жесткий блок!
    if (targetMember.role === OrgRole.RESPONSIBLE) {
      return {
        allowed: false,
        error:
          "Запрещено. Менеджер не может удалить другого ответственного сотрудника (RESPONSIBLE). Это действие доступно только суперадминистратору.",
      };
    }

    return { allowed: true, error: null };
  }

  // 🔵 СЦЕНАРИЙ В: Редактирование карточки (UPDATE)
  if (actionType === EMPLOYEE_MANAGE_ACTIONS.UPDATE) {
    if (!targetEmployeeId) {
      return {
        allowed: false,
        error: "Не указан идентификатор сотрудника для обновления",
      };
    }

    // Ограничение полей (что менять можно только должность) у нас запечатано на уровне Zod .pick() в самом экшене!
    return { allowed: true, error: null };
  }

  return { allowed: false, error: "Неизвестный тип операции" };
};
