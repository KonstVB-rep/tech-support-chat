export const Role = {
  ADMIN: "ADMIN",
  SUPPORT: "SUPPORT",
  RESPONSIBLE: "RESPONSIBLE",
  MEMBER: "MEMBER",
} as const;

export type SystemRole = (typeof Role)[keyof typeof Role];
