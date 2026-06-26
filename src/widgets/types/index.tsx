export const SIDEBAR_TYPES = {
    CHATS: "chats",
    MEMBERS: "members",
    SETTINGS: "settings",
} as const;

export type SidebarTypes = typeof SIDEBAR_TYPES[keyof typeof SIDEBAR_TYPES];