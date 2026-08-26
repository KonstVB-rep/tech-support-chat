"use client"

import dynamic from "next/dynamic"
import type { ProfileData } from "@/entities/profile/ui/ProfileCard"
import { AccountClientSkeleton } from "@/entities/profile/ui/ProfilePageContent"
import { ToggleThemeSkeleton } from "@/features/toggle-theme/ui/ToggleTheme"
import {
  ACTIVE_SCREEN,
  type ActiveScreenKeys,
} from "@/features/update-account-info/model/constants"
import { AccountDelFormSkeleton } from "@/features/update-account-info/ui/AccountDelForm"
import { ActiveSessionsSkeleton } from "@/features/update-account-info/ui/ActiveSessions"
import { cn } from "@/shared/lib/utils"
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen"

const ProfilePageContent = dynamic(
  () => import("@/entities/profile/ui/ProfilePageContent").then((mod) => mod.ProfilePageContent),
  {
    ssr: false,
    loading: () => <AccountClientSkeleton />,
  },
)

const ToggleTheme = dynamic(
  () => import("@/features/toggle-theme/ui/ToggleTheme").then((mod) => mod.ToggleTheme),
  {
    ssr: false,
    loading: () => <ToggleThemeSkeleton />,
  },
)

const ActiveSessions = dynamic(
  () =>
    import("@/features/update-account-info/ui/ActiveSessions").then((mod) => mod.ActiveSessions),
  {
    ssr: false,
    loading: () => <ActiveSessionsSkeleton />,
  },
)

const AccountDelForm = dynamic(
  () =>
    import("@/features/update-account-info/ui/AccountDelForm").then((mod) => mod.AccountDelForm),
  {
    ssr: false,
    loading: () => <AccountDelFormSkeleton />,
  },
)

export const ScreenSettings = ({
  activeScreen,
  profile,
  isSupport,
  className,
}: {
  activeScreen: ActiveScreenKeys | null
  profile: ProfileData
  isSupport: boolean
  className?: string
}) => {
  return (
    <div className={cn("flex h-dvh w-full flex-col bg-primary-foreground", className)}>
      <WrapperHeaderScreen>
        <h2 className="w-full text-center font-semibold uppercase">
          {activeScreen && ACTIVE_SCREEN[activeScreen]}
        </h2>
      </WrapperHeaderScreen>
      <div className="min-h-0 flex-1 space-y-10 overflow-y-auto bg-background pb-10">
        <div className="mx-auto grid w-full max-w-[600px] place-items-start justify-items-center p-3 md:max-w-2xl">
          {activeScreen === "profile" && (
            <ProfilePageContent isSupport={isSupport} profile={profile} />
          )}

          {activeScreen === "session" && <ActiveSessions />}
          {activeScreen === "decoration" && <ToggleTheme />}
          {activeScreen === "accountDel" && <AccountDelForm />}
        </div>
      </div>
    </div>
  )
}
