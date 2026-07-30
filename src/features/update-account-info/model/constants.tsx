import { LaptopMinimalCheck, PaintbrushVertical, Trash, User } from "lucide-react"

export const ACTIVE_SCREEN = {
  profile: "Профиль",
  session: "Сессии",
  decoration: "Оформление",
  accountDel: "Удаление аккаунта",
} as const

export type ActiveScreenDataItem = {
  key: ActiveScreenKeys
  title: string
  icon: React.ReactNode
  variant: "outline" | "destructive" | "link" | "default" | "secondary" | "ghost" | null | undefined
}

export const ACTIVE_SCREEN_DATA: ActiveScreenDataItem[] = [
  {
    key: "profile",
    title: "Профиль",
    icon: <User className="h-4 w-4 text-muted-foreground" />,
    variant: null,
  },
  {
    key: "session",
    title: "Сессии",
    icon: <LaptopMinimalCheck className="h-4 w-4 text-muted-foreground" />,
    variant: null,
  },
  {
    key: "decoration",
    title: "Оформление",
    icon: <PaintbrushVertical className="h-4 w-4 text-muted-foreground" />,
    variant: null,
  },
  {
    key: "accountDel",
    title: "Удаление аккаунта",
    icon: <Trash className="h-4 w-4 text-primary" />,
    variant: "destructive",
  },
]

export type ActiveScreenKeys = keyof typeof ACTIVE_SCREEN
