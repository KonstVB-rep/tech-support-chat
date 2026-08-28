// src/features/manage-employee/actions/update.ts
"use server"
import { updateTag } from "next/cache"
import { updateEmployeeFormSchema } from "@/entities/employee"
import { prisma } from "@/prisma/prisma-client"
import { getSession } from "@/shared/lib/server-current-user"
import type { ActionState, UserRoleTypes } from "@/shared/lib/types"
import { EMPLOYEE_MANAGE_ACTIONS, hasEmployeeManagePermission } from "../lib/checkPermission"

export const updateEmployeeAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const session = await getSession()
    if (!session?.user) {
      return { success: false, message: null, error: "Не авторизован" }
    }

    const employeeId = formData.get("employeeId") as string
    const organizationId = formData.get("organizationId") as string

    const check = await hasEmployeeManagePermission({
      user: { id: session.user.id, role: session.user.role as UserRoleTypes },
      organizationId,
      targetEmployeeId: employeeId,
      actionType: EMPLOYEE_MANAGE_ACTIONS.UPDATE,
    })

    if (!check.allowed) {
      return { success: false, message: null, error: check.error }
    }

    if (!employeeId || !organizationId) {
      return {
        success: false,
        message: null,
        error: "Отсутствуют необходимые идентификаторы сотрудника или компании",
      }
    }

    const rawData = Object.fromEntries(formData.entries())

    const validated = updateEmployeeFormSchema.safeParse(rawData)

    if (!validated.success) {
      return {
        success: false,
        message: null,
        error: "Ошибка валидации переданных данных формы",
      }
    }

    const { position, name, role } = validated.data

    const employee = await prisma.organizationMember.findUnique({
      where: { id: employeeId, organizationId },
    })

    if (!employee) {
      return {
        success: false,
        message: null,
        error: "Сотрудник в данной организации не найден",
      }
    }

    await prisma.organizationMember.update({
      where: { id: employeeId },
      data: {
        position: position || null,
        role: role as "RESPONSIBLE" | "MEMBER",
      },
    })

    updateTag(`employees-${organizationId}`)

    return {
      success: true,
      message: `Данные сотрудника - ${name?.toUpperCase} успешно сохранены`,
      error: null,
    }
  } catch (error) {
    console.error("Ошибка при выполнении updateEmployeeAction:", error)
    return {
      success: false,
      message: null,
      error: "Критическая ошибка базы данных при сохранении профиля сотрудника",
    }
  }
}
