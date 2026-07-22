"use client";

import { ProfileData } from "@/entities/profile/ui/ProfileCard";

import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut";
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle";
import {
  ACTIVE_SCREEN,
  ActiveScreenKeys,
} from "@/features/update-account-info/model/constants";
import { AvatarChangeForm } from "@/features/update-account-info/ui/AvatarChangeForm";
import ChangeEmailForm from "@/features/update-account-info/ui/ChangeEmailForm";
import ChangePhoneForm from "@/features/update-account-info/ui/ChangePhoneForm";
import PasswordChangeForm from "@/features/update-account-info/ui/PasswordChangeForm";
import { cn } from "@/shared/lib/utils";

import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import dynamic from "next/dynamic";

const ToggleTheme = dynamic(
  () =>
    import("@/features/toggle-theme/ui/ToggleTheme").then(
      (mod) => mod.ToggleTheme,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="text-xs text-muted-foreground animate-pulse py-4">
        Загрузка...
      </div>
    ),
  },
);

const ActiveSessions = dynamic(
  () =>
    import("@/features/update-account-info/ui/ActiveSessions").then(
      (mod) => mod.ActiveSessions,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="text-xs text-muted-foreground animate-pulse py-4">
        Загрузка...
      </div>
    ),
  },
);

const AccountDelForm = dynamic(
  () =>
    import("@/features/update-account-info/ui/AccountDelForm").then(
      (mod) => mod.AccountDelForm,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="text-xs text-muted-foreground animate-pulse py-4">
        Загрузка...
      </div>
    ),
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
            <div className="grid gap-3 w-full max-w-2xl">
              <AvatarChangeForm
                imageUrl={profile.imageUrl}
                profileId={profile.id}
              />
              <div className="text-center w-fit px-4 py-2 border rounded-full mx-auto mb-4 bg-muted">
                {profile.name.toUpperCase()}
              </div>
              <ChangeEmailForm
                emailProfile={profile.email}
                profileId={profile.id}
              />
              <ChangePhoneForm
                phoneProfile={profile.phone}
                profileId={profile.id}
              />
              <PasswordChangeForm />
              <PushSettingsToggle
                profileId={profile.id}
                isSupportEngineer={isSupport}
                pushEnabled={profile.pushEnabled}
                isViewedByAdmin={!isSupport}
                source="account"
              />
              <ButtonSignOut
                className="flex w-full field-height var gap-1 items-center justify-center p-2 rounded-xl select-none transition-colors mx-auto hover:bg-muted/50 hover:text-foreground"
                withIcon={true}
                withText={true}
              />
            </div>
          )}

          {activeScreen === "session" && <ActiveSessions />}
          {activeScreen === "decoration" && <ToggleTheme />}
          {activeScreen === "accountDel" && <AccountDelForm />}
        </div>
      </div>
    </div>
  );
};
