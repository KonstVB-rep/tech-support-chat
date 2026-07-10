import { OrgRole, ChatRole } from "@prisma/client";

// ✅ Роли в организации (OrganizationMember)
export const ORG_ROLE_LABELS: Record<OrgRole, string> = {
  [OrgRole.RESPONSIBLE]: "Ответственное лицо",
  [OrgRole.MEMBER]: "Сотрудник",
};

export type UserRoleKey = "ADMIN" | "USER";
export type UserRoleValue = "admin" | "user";

export const USER_ROLE: Record<UserRoleKey, UserRoleValue> = {
  ADMIN: "admin",
  USER: "user",
} as const;


// ✅ Роли в чате (ChatMember)
export const CHAT_ROLE_LABELS: Record<ChatRole, string> = {
  [ChatRole.ADMIN]: "Администратор",
  [ChatRole.MEMBER]: "Участник",
};
