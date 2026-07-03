// export const Role = {
//   ADMIN: "ADMIN",
//   SUPPORT: "SUPPORT",
//   RESPONSIBLE: "RESPONSIBLE",
//   MEMBER: "MEMBER",
// } as const;

import { USER_ROLE } from "@/shared/constants";

// export type SystemRole = (typeof Role)[keyof typeof Role];

export type ActionState = {
  success: boolean;
  message: string | null;
  error: string | null;
};

export type DeleteActionState = {
  success: boolean;
  deletedCount?: number;
  error: string | null;
};

export type UserRoleTypes = (typeof USER_ROLE)[keyof typeof USER_ROLE];
