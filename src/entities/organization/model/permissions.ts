import { Role } from "@prisma/client";
import {
  hasPermission as check,
  hasAnyPermission as checkAny,
  hasAllPermissions as checkAll,
} from "@/shared/lib/permissions";

// Все действия над организациями
export type OrganizationPermission =
  | "organization.view" // Видеть организации
  | "organization.create" // Создать организацию
  | "organization.update" // Обновить организацию
  | "organization.delete" // Удалить организацию
  | "organizations.view" // Видеть список организаций

  // Участники организации
  | "organization.member.view" // Видеть участников
  | "organization.member.add" // Добавить участника
  | "organization.member.remove" // Удалить участника
  | "organization.member.update"; // Изменить роль участника

// Роли системы

// Маппинг: роль → permissions
export const ROLE_PERMISSIONS_ORG: Record<Role, OrganizationPermission[]> = {
  ADMIN: [
    "organization.view",
    "organizations.view",
    "organization.create",
    "organization.update",
    "organization.delete",
    "organization.member.view",
    "organization.member.add",
    "organization.member.remove",
    "organization.member.update",
  ],

  SUPPORT: ["organization.view", "organization.member.view"],

  RESPONSIBLE: [
    "organization.view", // свою организацию
    "organization.member.view", // своих сотрудников
    "organization.member.add", // добавлять сотрудников
    "organization.member.remove", // удалять сотрудников
    "organization.member.update", // менять роли сотрудников
  ],

  MEMBER: [
    "organization.view", // только свою организацию
  ],
};

export const hasOrganizationPermission = (
  role: Role,
  permission: OrganizationPermission,
) => check(role, permission, ROLE_PERMISSIONS_ORG);

export const hasAnyOrganizationPermission = (
  role: Role,
  permissions: OrganizationPermission[],
) => checkAny(role, permissions, ROLE_PERMISSIONS_ORG);

export const hasAllOrganizationPermissions = (
  role: Role,
  permissions: OrganizationPermission[],
) => checkAll(role, permissions, ROLE_PERMISSIONS_ORG);

export const getOrganizationPermissions = (role: Role) => {
  return ROLE_PERMISSIONS_ORG[role] ?? [];
};
