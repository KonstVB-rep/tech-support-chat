import { OrgRole, ChatRole } from "@prisma/client";
import {
  MessagesSquare,
  Settings,
  Users,
  UserRoundCog,
  Building2,
} from "lucide-react";

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

export const CHAT_ROLE_LABELS: Record<ChatRole, string> = {
  [ChatRole.ADMIN]: "Администратор",
  [ChatRole.MEMBER]: "Участник",
};

export type NavigationLink = {
  href: string;
  title: string;
  icon: React.ReactNode;
  isAdminOnly?: boolean;
  isResponsibleOnly?: boolean;
};

export const LINKS_NAV: NavigationLink[] = [
  {
    href: "/chats",
    title: "Чаты",
    icon: <MessagesSquare className="size-5" />,
  },
  {
    href: "/user-organizations",
    title: "Компания",
    icon: <Building2 className="size-5" />,
    isResponsibleOnly: true,
  },
  {
    href: "/admin/organizations",
    title: "Клиенты",
    icon: <Users className="size-5" />,
    isAdminOnly: true,
  },
  {
    href: "/admin/staff",
    title: "Инженеры",
    icon: <UserRoundCog className="size-5" />,
    isAdminOnly: true,
  },
  {
    href: "/account",
    title: "Настройки",
    icon: <Settings className="size-5" />,
  },
];
