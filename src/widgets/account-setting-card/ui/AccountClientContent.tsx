"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import type { ProfileData } from "@/entities/profile/ui/ProfileCard"
import { checkIsSupportActionMyProfileId } from "@/features/update-account-info/api/checkIsSupportAction"
import {
  ACTIVE_SCREEN,
  ACTIVE_SCREEN_DATA,
  type ActiveScreenDataItem,
  type ActiveScreenKeys,
} from "@/features/update-account-info/model/constants"
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/components/button"
import { SharedLayoutBg } from "@/shared/ui/components/motion/shared-layout-bg"
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent"
import { ScreenSettings } from "./ScreenSettings"

const AccountClientContent = ({ profile }: { profile: ProfileData }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const screenParam = searchParams.get("screen") as ActiveScreenKeys | null
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const resolvedScreen: ActiveScreenKeys =
    screenParam && ACTIVE_SCREEN[screenParam] ? screenParam : "profile"

  const activeScreen: ActiveScreenKeys | null = isDesktop
    ? resolvedScreen
    : screenParam && ACTIVE_SCREEN[screenParam]
      ? screenParam
      : null

  const [localMobileScreen, setLocalMobileScreen] = useState<ActiveScreenKeys | null>(null)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  useEffect(() => {
    if (isDesktop && !screenParam) {
      router.replace("/account?screen=profile", { scroll: false })
    }
  }, [isDesktop, screenParam, router])

  useEffect(() => {
    if (!isDesktop && activeScreen) {
      setLocalMobileScreen(activeScreen)
    }
  }, [activeScreen, isDesktop])

  const { data: isSupport = false } = useQuery({
    queryKey: ["current-user-is-support"],
    queryFn: () => checkIsSupportActionMyProfileId(profile.id),
    staleTime: 10 * 60 * 1000,
  })

  const handleScreenSelect = (screen: ActiveScreenKeys | null) => {
    console.log(`⌨️ Переключение экрана настроек PWA на: ${screen}`)
    if (!screen) {
      router.push("/account", { scroll: false })
      if (!isDesktop) setIsMobileDrawerOpen(false)
      return
    }

    if (!isDesktop) {
      setLocalMobileScreen(screen)
      setIsMobileDrawerOpen(true)
    }

    router.push(`/account?screen=${screen}`, { scroll: false })
  }

  const handleDrawerClose = (isOpen: boolean) => {
    setIsMobileDrawerOpen(isOpen)
    if (!isOpen) {
      router.push("/account", { scroll: false })
    }
  }
  return (
    <>
      <aside className="flex h-dvh w-full shrink-0 flex-col justify-between bg-sidebar md:w-80 md:justify-start">
        <h1 className="flex h-14 shrink-0 items-center justify-center p-2 font-semibold text-xl md:justify-start">
          Настройки
        </h1>

        <div className="min-h-0 w-full flex-1 select-none space-y-2 overflow-y-auto p-3">
          <SharedLayoutBg className="gap-2" inset={0}>
            {ACTIVE_SCREEN_DATA.map((screen: ActiveScreenDataItem) => {
              const isActiveDesktop = screen.key === activeScreen
              return (
                <div className="relative w-full" key={screen.key}>
                  <Button
                    className={cn(
                      "flex h-12 w-full items-center justify-start p-3 shadow-none",
                      isActiveDesktop
                        ? "md:bg-linear-to-r md:from-[#eae9f6] md:to-[#ebebeb] md:dark:bg-[linear-gradient(90deg,transparent,#000)]"
                        : screen.variant !== "destructive"
                          ? "border-none bg-transparent"
                          : "",
                    )}
                    onClick={() => handleScreenSelect(screen.key)}
                    variant={screen.variant}
                  >
                    <span
                      className={cn(
                        "flex w-full items-center justify-start gap-2 font-semibold text-sm",
                        screen.variant === "destructive" && "text-primary",
                      )}
                    >
                      {screen.icon} {screen.title}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              )
            })}
          </SharedLayoutBg>
        </div>
      </aside>

      <ScreenSettings
        activeScreen={activeScreen}
        className="hidden md:flex"
        isSupport={isSupport}
        profile={profile}
      />

      <DrawerComponent
        className="h-full data-[vaul-drawer-direction=left]:h-[100dvh] data-[vaul-drawer-direction=left]:max-h-[100vh] data-[vaul-drawer-direction=left]:w-full data-[vaul-drawer-direction=left]:max-w-full! md:hidden"
        onOpenChange={handleDrawerClose}
        open={isMobileDrawerOpen}
        side={"left"}
      >
        <div className="relative flex h-full flex-col gap-3 bg-background md:px-4">
          <div className="-translate-y-1/2 absolute top-1/2 right-0 h-3/12 w-2 rounded-s-md bg-chart-2" />
          <ScreenSettings
            activeScreen={localMobileScreen}
            className="flex md:hidden"
            isSupport={isSupport}
            profile={profile}
          />
        </div>
      </DrawerComponent>
    </>
  )
}

export default AccountClientContent
