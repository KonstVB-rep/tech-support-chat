"use client";

import { ProfileData } from "@/entities/profile/ui/ProfileCard";
import {
  AvatarChangeForm,
  ChangeEmailForm,
  PasswordChangeForm,
} from "@/entities/user";
import { checkIsSupportActionNyProfileId } from "@/entities/user/api/checkIsSupportAction";
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut";
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import WrapperHeaderScreen from "@/shared/ui/custom/WrapperHeaderScreen";
import { SharedLayoutBg } from "@/shared/ui/motion/shared-layout-bg";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  LaptopMinimalCheck,
  PaintbrushVertical,
  Trash,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Decorations = dynamic(
  () => import("@/entities/user/ui/Decorations").then((mod) => mod.Decorations),
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
    import("@/entities/user/ui/ActiveSessions").then(
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
  () => import("@/entities/user").then((mod) => mod.AccountDelForm),
  {
    ssr: false,
    loading: () => (
      <div className="text-xs text-muted-foreground animate-pulse py-4">
        Загрузка...
      </div>
    ),
  },
);

const ACTIVE_SCREEN = {
  profile: "Профиль",
  session: "Сессии",
  decoration: "Оформление",
  accountDel: "Удаление аккаунта",
} as const;

type ActiveScreenDataItem = {
  key: ActiveScreenKeys;
  title: string;
  icon: React.ReactNode;
  variant:
    | "outline"
    | "destructive"
    | "link"
    | "default"
    | "secondary"
    | "ghost"
    | null
    | undefined;
};

const ACTIVE_SCREEN_DATA: ActiveScreenDataItem[] = [
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
    icon: <Trash className="h-4 w-4 text-muted-foreground" />,
    variant: "destructive",
  },
];

export type ActiveScreenKeys = keyof typeof ACTIVE_SCREEN;

const AccountClientContent = ({ profile }: { profile: ProfileData }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const screenParam = searchParams.get("screen") as ActiveScreenKeys;
  const activeScreen: ActiveScreenKeys = ACTIVE_SCREEN[screenParam]
    ? screenParam
    : "profile";

  const [localMobileScreen, setLocalMobileScreen] =
    useState<ActiveScreenKeys>(activeScreen);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    setLocalMobileScreen(activeScreen);
  }, [activeScreen]);

  const { data: isSupport = false } = useQuery({
    queryKey: ["current-user-is-support"],
    queryFn: () => checkIsSupportActionNyProfileId(profile.id),
    staleTime: 10 * 60 * 1000,
  });

  const handleScreenSelect = (screen: ActiveScreenKeys) => {
    console.log(`⌨️ Переключение экрана настроек PWA на: ${screen}`);

    setLocalMobileScreen(screen);

    router.push(`/account?screen=${screen}`, { scroll: false });

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileDrawerOpen(true);
    }
  };

  return (
    <>
      <aside className="w-full flex flex-col justify-between md:justify-start md:w-80 h-dvh shrink-0 bg-sidebar">
        <h1 className="text-xl flex items-center font-semibold p-2 text-start h-14 shrink-0">
          Настройки
        </h1>

        <div className="flex-1 min-h-0 overflow-y-auto w-full space-y-2 select-none p-3">
          <SharedLayoutBg inset={0}>
            {ACTIVE_SCREEN_DATA.map((screen: ActiveScreenDataItem) => {
              const isActiveDesktop = screen.key === activeScreen;
              console.log(
                isActiveDesktop,
                screen.key,
                "**********************",
              );

              return (
                <div key={screen.key} className="w-full relative">
                  <Button
                    variant={screen.variant}
                    className={cn(
                      "shadow-none flex items-center justify-start w-full h-12 p-3",
                      isActiveDesktop
                        ? "md:border-solid md:border-blue-500 md:border"
                        : "bg-transparent border-none",
                    )}
                    onClick={() => handleScreenSelect(screen.key)}
                  >
                    <span
                      className={cn(
                        "w-full text-sm font-semibold flex items-center justify-start gap-2",
                        screen.variant === "destructive" && "text-white",
                      )}
                    >
                      {screen.icon} {screen.title}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
          </SharedLayoutBg>
        </div>
      </aside>

      <ScreenSettings
        activeScreen={activeScreen}
        profile={profile}
        isSupport={isSupport}
        className="hidden md:flex"
      />

      <DrawerComponent
        open={isMobileDrawerOpen}
        onOpenChange={setIsMobileDrawerOpen}
        className="data-[vaul-drawer-direction=left]:max-h-[100vh] data-[vaul-drawer-direction=left]:h-[100dvh] md:hidden data-[vaul-drawer-direction=left]:max-w-full! data-[vaul-drawer-direction=left]:w-full h-full"
        side={"left"}
      >
        <div className="md:px-4 flex flex-col gap-3 relative h-full bg-background">
          <div className="absolute right-0 h-3/12 bg-chart-2 rounded-s-md top-1/2 -translate-y-1/2 w-2" />
          <ScreenSettings
            activeScreen={localMobileScreen}
            profile={profile}
            isSupport={isSupport}
            className="flex md:hidden"
          />
        </div>
      </DrawerComponent>
    </>
  );
};

export default AccountClientContent;

const ScreenSettings = ({
  activeScreen,
  profile,
  isSupport,
  className,
}: {
  activeScreen: ActiveScreenKeys;
  profile: ProfileData;
  isSupport: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col w-full h-full bg-primary-foreground",
        className,
      )}
    >
      <WrapperHeaderScreen>
        <h2 className="text-center font-semibold uppercase w-full">
          {ACTIVE_SCREEN[activeScreen]}
        </h2>
      </WrapperHeaderScreen>
      <div className="overflow-y-auto space-y-10 flex-1 h-full bg-background">
        <div className="p-3 w-full grid place-items-start justify-items-center max-w-[400px] md:max-w-2xl mx-auto">
          {activeScreen === "profile" && (
            <div className="grid gap-3 w-full max-w-2xl">
              <AvatarChangeForm
                imageUrl={profile.imageUrl}
                profileId={profile.id}
              />
              <ChangeEmailForm
                emailProfile={profile.email}
                profileId={profile.id}
              />
              <PasswordChangeForm />
              <PushSettingsToggle
                profileId={profile.id}
                isSupportEngineer={!isSupport}
                pushEnabled={profile.pushEnabled}
                isViewedByAdmin={false}
              />
              <ButtonSignOut
                className="flex w-full h-10 var gap-1 items-center justify-center p-2 rounded-xl select-none transition-colors mx-auto hover:bg-muted/50 hover:text-foreground"
                withIcon={true}
                withText={true}
              />
            </div>
          )}

          {activeScreen === "session" && <ActiveSessions />}
          {activeScreen === "decoration" && <Decorations />}
          {activeScreen === "accountDel" && <AccountDelForm />}
        </div>
      </div>
    </div>
  );
};
