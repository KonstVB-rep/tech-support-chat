// src/shared/lib/permissions.ts

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

// 🚀 БЕСТ-ПРАКТИКС ТИПИЗАЦИЯ: Наш новый объединенный тип ролей для логики доступов
export type AppChatRole = "admin" | "SUPPORT" | "RESPONSIBLE" | "MEMBER";

// ✅ Маппинг: теперь ключами являются наши чистые строковые роли
export const ROLE_PERMISSIONS_CHAT: Record<AppChatRole, ChatPermission[]> = {
  // Обычный сотрудник клиента внутри компании
  MEMBER: ["ticket.create", "message.send", "message.delete.own"],

  // Инженер техподдержки портала
  SUPPORT: [
    "ticket.create",
    "ticket.close",
    "message.send",
    "message.delete.own",
    "message.delete.any",
  ],

  // Ответственное лицо клиента (Директор/Управляющий)
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

  // Глобальный суперадмин системы Better Auth
  admin: [
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

// ✅ Хелперы: теперь принимают наш чистый тип AppChatRole вместо Role из Prisma
export const hasPermissionChat = (
  role: AppChatRole,
  permission: ChatPermission,
): boolean => {
  return check(role, permission, ROLE_PERMISSIONS_CHAT);
};

export const hasAnyPermissionChat = (
  role: AppChatRole,
  permissions: ChatPermission[],
): boolean => {
  return checkAny(role, permissions, ROLE_PERMISSIONS_CHAT);
};

export const hasAllPermissionChat = (
  role: AppChatRole,
  permissions: ChatPermission[],
): boolean => {
  return checkAll(role, permissions, ROLE_PERMISSIONS_CHAT);
};

export const getPermissions = (role: AppChatRole): ChatPermission[] => {
  return ROLE_PERMISSIONS_CHAT[role] ?? [];
};
