import type { OrgRole } from "@prisma/client"

// Действия над сотрудниками
type EmployeePermission =
  | "employee.view" // Видеть сотрудников
  | "employee.create" // Создать сотрудника
  | "employee.update" // Обновить данные
  | "employee.delete" // Уволить сотрудника
  | "employee.view.phone" // Видеть телефон (конфиденциально)

export const ROLE_PERMISSIONS: Record<OrgRole, EmployeePermission[]> = {
  RESPONSIBLE: [
    "employee.view",
    "employee.create",
    "employee.update",
    "employee.delete",
    "employee.view.phone", // видит телефоны своих сотрудников
  ],

  MEMBER: [
    "employee.view", // видит коллег, без телефона
  ],
}
