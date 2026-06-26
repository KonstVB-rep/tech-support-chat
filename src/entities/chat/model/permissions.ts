import { Role } from "@prisma/client";

import {
  hasPermission as check,
  hasAnyPermission as checkAny,
  hasAllPermissions as checkAll,
} from "@/shared/lib/permissions";

// Все возможные действия в системе
export type ChatPermission =
  // Тикеты
  | "ticket.create" // Создать тикет
  | "ticket.view.all" // Видеть все тикеты (не только свои)
  | "ticket.delete" // Удалить тикет
  | "ticket.assign" // Назначить исполнителя
  | "ticket.close" // Закрыть тикет

  // Сообщения
  | "message.send" // Отправить сообщение
  | "message.delete.own" // Удалить своё сообщение
  | "message.delete.any" // Удалить любое сообщение

  // Пользователи
  | "user.manage.roles" // Менять роли пользователей
  | "user.view.all" // Видеть всех пользователей

  // Статистика
  | "stats.view"; // Видеть статистику

// Роли в чате

// ✅ Маппинг: роль → список permissions
export const ROLE_PERMISSIONS_CHAT: Record<Role, ChatPermission[]> = {
  MEMBER: ["ticket.create", "message.send", "message.delete.own"],

  SUPPORT: [
    "ticket.create",
    "ticket.close",
    "message.send",
    "message.delete.own",
    "message.delete.any",
  ],

  RESPONSIBLE: [
    "ticket.create",
    "ticket.view.all",
    "ticket.assign",
    "ticket.close",
    "message.send",
    "message.delete.own",
    "message.delete.any",
    "user.view.all",
    "stats.view",
  ],

  ADMIN: [
    // Админ имеет ВСЕ permissions
    "ticket.create",
    "ticket.view.all",
    "ticket.delete",
    "ticket.assign",
    "ticket.close",
    "message.send",
    "message.delete.own",
    "message.delete.any",
    "user.manage.roles",
    "user.view.all",
    "stats.view",
  ],
};

// ✅ Хелпер: проверить есть ли permission
export const hasPermissionChat = (
  role: Role,
  permission: ChatPermission,
): boolean => {
  return check(role, permission, ROLE_PERMISSIONS_CHAT);
};

export const hasAnyPermissionChat = (
  role: Role,
  permissions: ChatPermission[],
): boolean => {
  return checkAny(role, permissions, ROLE_PERMISSIONS_CHAT);
};

export const hasAllPermissionChat = (
  role: Role,
  permissions: ChatPermission[],
): boolean => {
  return checkAll(role, permissions, ROLE_PERMISSIONS_CHAT);
};

// ✅ Хелпер: получить все permissions роли
export const getPermissions = (role: Role): ChatPermission[] => {
  return ROLE_PERMISSIONS_CHAT[role] ?? [];
};
