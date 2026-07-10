// src/features/manage-organization/actions/update.ts
"use server";
import { prisma } from "@/prisma/prisma-client";
import { USER_ROLE } from "@/shared/constants";
import { getSession } from "@/shared/lib/server-current-user";
import { ActionState } from "@/shared/lib/types";
import { updateTag } from "next/cache";

export const updateOrganizationAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { success: false, message: null, error: "Не авторизован" };
    }

    if (session.user.role !== USER_ROLE.ADMIN) {
      return {
        success: false,
        message: null,
        error: "Доступ запрещен. Требуются права администратора.",
      };
    }

    const orgId = formData.get("id") as string;
    if (!orgId) {
      return {
        success: false,
        message: null,
        error: "Идентификатор организации отсутствует",
      };
    }

    // Собираем данные из FormData
    const name = formData.get("name") as string;
    const legalAddress = formData.get("legalAddress") as string;
    const actualAddress = formData.get("actualAddress") as string;
    const inn = formData.get("inn") as string;
    const contractNumber = formData.get("contractNumber") as string;
    const timeSupportFrom = formData.get("timeSupportFrom") as string;
    const timeSupportTo = formData.get("timeSupportTo") as string;

    // Безопасно парсим даты контракта
    const contractStartRaw = formData.get("contractStart") as string;
    const contractEndRaw = formData.get("contractEnd") as string;

    const duplicateContract = await prisma.organization.findFirst({
      where: {
        contractNumber,
        id: { not: orgId }, // Ищем везде, кроме редактируемой сейчас компании
      },
    });

    if (duplicateContract) {
      return {
        success: false,
        message: null,
        error: `Номер договора "${contractNumber}" уже зарегистрирован за компанией "${duplicateContract.name}"`,
      };
    }

    const duplicateInn = await prisma.organization.findFirst({
      where: {
        inn,
        id: { not: orgId },
      },
    });

    if (duplicateInn) {
      return {
        success: false,
        message: null,
        error: `Организация с ИНН ${inn} уже существует в базе`,
      };
    }

    const org = await prisma.organization.update({
      where: { id: orgId },
      data: {
        name,
        legalAddress,
        actualAddress: actualAddress || null,
        inn,
        contractNumber,
        timeSupportFrom,
        timeSupportTo,
        contractStart: contractStartRaw
          ? new Date(contractStartRaw)
          : new Date(),
        contractEnd: contractEndRaw ? new Date(contractEndRaw) : new Date(),
      },
    });

    // 🎯 ИСПРАВЛЕНО: Сбрасываем кэш списка и точечный кэш карточки организации
    updateTag("organizations");
    updateTag(`organization-${orgId}`);

    return {
      success: true,
      message: `Данные организации "${org.name}" успешно обновлены`,
      error: null,
    };
  } catch (error) {
    console.error("Ошибка при обновлении организации:", error);
    return {
      success: false,
      message: null,
      error: "Ошибка при обновлении организации",
    };
  }
};
