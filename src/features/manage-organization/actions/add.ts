"use server"

import { updateTag } from "next/cache"
import { prisma } from "@/prisma/prisma-client"
import { USER_ROLE } from "@/shared/constants"
import { getSession } from "@/shared/lib/server-current-user"
import type { ActionState } from "@/shared/lib/types"

export const addOrganizationAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, message: null, error: "Не авторизован" }
    }

    if (session.user.role !== USER_ROLE.ADMIN) {
      return {
        success: false,
        message: null,
        error: "Доступ запрещен. Требуются права администратора.",
      }
    }

    const name = formData.get("name") as string
    const legalAddress = formData.get("legalAddress") as string
    const actualAddress = formData.get("actualAddress") as string
    const inn = formData.get("inn") as string
    const contractNumber = formData.get("contractNumber") as string
    const timeSupportFrom = formData.get("timeSupportFrom") as string
    const timeSupportTo = formData.get("timeSupportTo") as string
    const contractStartRaw = formData.get("contractStart") as string
    const contractEndRaw = formData.get("contractEnd") as string

    if (!name || !legalAddress || !inn || !contractNumber) {
      return {
        success: false,
        message: null,
        error: "Заполните обязательные поля на форме",
      }
    }

    const existingOrg = await prisma.organization.findUnique({
      where: { inn },
    })
    if (existingOrg) {
      return {
        success: false,
        message: null,
        error: "Организация с таким ИНН уже зарегистрирована",
      }
    }

    await prisma.organization.create({
      data: {
        name,
        legalAddress,
        actualAddress: actualAddress || null,
        inn,
        contractNumber,
        timeSupportFrom,
        timeSupportTo,
        contractStart: contractStartRaw ? new Date(contractStartRaw) : new Date(),
        contractEnd: contractEndRaw ? new Date(contractEndRaw) : new Date(),
      },
    })

    updateTag("organizations")

    return {
      success: true,
      message: `Организация "${name}" успешно добавлена в систему`,
      error: null,
    }
  } catch (error) {
    console.error("Ошибка при создании организации:", error)
    return {
      success: false,
      message: null,
      error: "Критическая ошибка базы данных при создании клиента",
    }
  }
}
