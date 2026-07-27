"use client";

import { ProfileData } from "@/entities/profile/ui/ProfileCard";
import { AccountClientSkeleton } from "@/entities/profile/ui/ProfilePageContent";
import { ToggleThemeSkeleton } from "@/features/toggle-theme/ui/ToggleTheme";
import {
  ACTIVE_SCREEN,
  ActiveScreenKeys,
} from "@/features/update-account-info/model/constants";
import { AccountDelFormSkeleton } from "@/features/update-account-info/ui/AccountDelForm";
import { ActiveSessionsSkeleton } from "@/features/update-account-info/ui/ActiveSessions";
import { cn } from "@/shared/lib/utils";

import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import dynamic from "next/dynamic";

const ProfilePageContent = dynamic(
  () =>
    import("@/entities/profile/ui/ProfilePageContent").then(
      (mod) => mod.ProfilePageContent,
    ),
  {
    ssr: false,
    loading: () => <AccountClientSkeleton />,
  },
);

const ToggleTheme = dynamic(
  () =>
    import("@/features/toggle-theme/ui/ToggleTheme").then(
      (mod) => mod.ToggleTheme,
    ),
  {
    ssr: false,
    loading: () => <ToggleThemeSkeleton />,
  },
);

const ActiveSessions = dynamic(
  () =>
    import("@/features/update-account-info/ui/ActiveSessions").then(
      (mod) => mod.ActiveSessions,
    ),
  {
    ssr: false,
    loading: () => <ActiveSessionsSkeleton />,
  },
);

const AccountDelForm = dynamic(
  () =>
    import("@/features/update-account-info/ui/AccountDelForm").then(
      (mod) => mod.AccountDelForm,
    ),
  {
    ssr: false,
    loading: () => <AccountDelFormSkeleton />,
  },
);

export const ScreenSettings = ({
  activeScreen,
  profile,
  isSupport,
  className,
}: {
  activeScreen: ActiveScreenKeys | null;
  profile: ProfileData;
  isSupport: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full h-dvh bg-primary-foreground",
        className,
      )}
    >
      <WrapperHeaderScreen>
        <h2 className="text-center font-semibold uppercase w-full">
          {activeScreen && ACTIVE_SCREEN[activeScreen]}
        </h2>
      </WrapperHeaderScreen>
      <div className="overflow-y-auto space-y-10 flex-1 min-h-0 bg-background pb-10">
        <div className="p-3 w-full grid place-items-start justify-items-center max-w-[600px] md:max-w-2xl mx-auto">
          {activeScreen === "profile" && (
            <ProfilePageContent profile={profile} isSupport={isSupport} />
          )}

          {activeScreen === "session" && <ActiveSessions />}
          {activeScreen === "decoration" && <ToggleTheme />}
          {activeScreen === "accountDel" && <AccountDelForm />}
        </div>
      </div>
    </div>
  );
};
