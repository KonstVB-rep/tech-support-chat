"use client"

import { ChevronRight, LaptopMinimalCheck, PaintbrushVertical, User } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut"
import type { ActiveScreenKeys } from "@/features/update-account-info/model/constants"
import { Button } from "@/shared/ui/components/button"

interface SidebarProfileListProps {
  setActiveScreen: (screen: ActiveScreenKeys) => void
}

export const SidebarProfileList = ({ setActiveScreen }: SidebarProfileListProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleScreenChange = (screen: ActiveScreenKeys) => {
    console.log(`⌨️ Переключение экрана настроек PWA на: ${screen}`)

    const params = new URLSearchParams(searchParams.toString())
    params.set("screen", screen)
    router.replace(`?${params.toString()}`)

    setActiveScreen(screen)
  }

  return (
    <div className="w-full flex-1 select-none space-y-2 overflow-y-auto p-3">
      <Button
        className="flex h-10 w-full flex-1 items-center justify-start p-3"
        onClick={() => handleScreenChange("profile")}
        variant="outline"
      >
        <span className="flex w-full items-center justify-start gap-2 font-semibold text-sm">
          <User className="h-4 w-4 text-muted-foreground" /> Профиль
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Button
        className="flex h-10 w-full flex-1 items-center justify-start p-3"
        onClick={() => handleScreenChange("session")}
        variant="outline"
      >
        <span className="flex w-full items-center justify-start gap-2 font-semibold text-sm">
          <LaptopMinimalCheck className="h-4 w-4 text-muted-foreground" /> Сессия
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Button
        className="flex h-10 w-full flex-1 items-center justify-start p-3"
        onClick={() => handleScreenChange("decoration")}
        variant="outline"
      >
        <span className="flex w-full items-center justify-start gap-2 font-semibold text-sm">
          <PaintbrushVertical className="h-4 w-4 text-muted-foreground" /> Оформление
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Button
        className="flex h-10 w-full flex-1 items-center justify-start p-3 hover:bg-destructive/5 hover:text-destructive"
        onClick={() => handleScreenChange("accountDel")}
        variant="destructive"
      >
        <span className="flex w-full items-center justify-start font-semibold text-sm text-white">
          Удалить аккаунт
        </span>
        <ChevronRight className="h-4 w-4" />
      </Button>

      <ButtonSignOut
        className="field-height var mx-auto flex w-full select-none items-center justify-center gap-1 rounded-xl p-2 transition-colors hover:bg-muted/50 hover:text-foreground"
        withIcon={true}
        withText={true}
      />
    </div>
  )
}
