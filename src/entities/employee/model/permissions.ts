import { Role } from "@prisma/client";

// Действия над сотрудниками
export type EmployeePermission =
  | "employee.view" // Видеть сотрудников
  | "employee.create" // Создать сотрудника
  | "employee.update" // Обновить данные
  | "employee.delete" // Уволить сотрудника
  | "employee.view.phone"; // Видеть телефон (конфиденциально)

export const ROLE_PERMISSIONS: Record<Role, EmployeePermission[]> = {
  ADMIN: [
    "employee.view",
    "employee.create",
    "employee.update",
    "employee.delete",
    "employee.view.phone",
  ],

  SUPPORT: [
    "employee.view", // видит всех, но без телефона
  ],

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
};
