"use client";

import { ProfileData } from "@/entities/profile/ui/ProfileCard";
import { checkIsSupportActionNyProfileId } from "@/features/update-account-info/api/checkIsSupportAction";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import { SharedLayoutBg } from "@/shared/ui/motion/shared-layout-bg";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ScreenSettings } from "./ScreenSettings";
import {
  ActiveScreenKeys,
  ACTIVE_SCREEN,
  ACTIVE_SCREEN_DATA,
  ActiveScreenDataItem,
} from "@/features/update-account-info/model/constants";

const AccountClientContent = ({ profile }: { profile: ProfileData }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const screenParam = searchParams.get("screen") as ActiveScreenKeys | null;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const resolvedScreen: ActiveScreenKeys =
    screenParam && ACTIVE_SCREEN[screenParam] ? screenParam : "profile";

  const activeScreen: ActiveScreenKeys | null = isDesktop
    ? resolvedScreen
    : screenParam && ACTIVE_SCREEN[screenParam]
      ? screenParam
      : null;

  const [localMobileScreen, setLocalMobileScreen] =
    useState<ActiveScreenKeys | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (isDesktop && !screenParam) {
      router.replace("/account?screen=profile", { scroll: false });
    }
  }, [isDesktop, screenParam, router]);

  useEffect(() => {
    if (!isDesktop && activeScreen) {
      setLocalMobileScreen(activeScreen);
    }
  }, [activeScreen, isDesktop]);

  const { data: isSupport = false } = useQuery({
    queryKey: ["current-user-is-support"],
    queryFn: () => checkIsSupportActionNyProfileId(profile.id),
    staleTime: 10 * 60 * 1000,
  });

  const handleScreenSelect = (screen: ActiveScreenKeys | null) => {
    console.log(`⌨️ Переключение экрана настроек PWA на: ${screen}`);
    if (!screen) {
      router.push("/account", { scroll: false });
      if (!isDesktop) setIsMobileDrawerOpen(false);
      return;
    }

    if (!isDesktop) {
      setLocalMobileScreen(screen);
      setIsMobileDrawerOpen(true);
    }

    router.push(`/account?screen=${screen}`, { scroll: false });
  };

  const handleDrawerClose = (isOpen: boolean) => {
    setIsMobileDrawerOpen(isOpen);
    if (!isOpen) {
      router.push("/account", { scroll: false });
    }
  };
  return (
    <>
      <aside className="w-full flex flex-col justify-between md:justify-start md:w-80 h-dvh shrink-0 bg-sidebar">
        <h1 className="text-xl flex items-center font-semibold p-2 justify-center md:justify-start h-14 shrink-0">
          Настройки
        </h1>

        <div className="flex-1 min-h-0 overflow-y-auto w-full space-y-2 select-none p-3">
          <SharedLayoutBg inset={0} className="gap-2">
            {ACTIVE_SCREEN_DATA.map((screen: ActiveScreenDataItem) => {
              const isActiveDesktop = screen.key === activeScreen;
              return (
                <div key={screen.key} className="w-full relative">
                  <Button
                    variant={screen.variant}
                    className={cn(
                      "shadow-none flex items-center justify-start w-full h-12 p-3",
                      isActiveDesktop
                        ? "md:dark:bg-[linear-gradient(90deg,transparent,#000)] md:bg-linear-to-r md:from-[#eae9f6] md:to-[#ebebeb]"
                        : screen.variant !== "destructive"
                          ? "bg-transparent border-none"
                          : "",
                    )}
                    onClick={() => handleScreenSelect(screen.key)}
                  >
                    <span
                      className={cn(
                        "w-full text-sm font-semibold flex items-center justify-start gap-2",
                        screen.variant === "destructive" && "text-primary",
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
        onOpenChange={handleDrawerClose}
        className="data-[vaul-drawer-direction=left]:max-h-[100vh] data-[vaul-drawer-direction=left]:h-[100dvh] md:hidden data-[vaul-drawer-direction=left]:max-w-full! data-[vaul-drawer-direction=left]:w-full h-full"
        side={"left"}
      >
        <div className="md:px-4 flex flex-col gap-3 relative h-full bg-background">
          <div className="absolute right-0 h-3/12 bg-chart-2 rounded-s-md top-1/2 -translate-y-1/2 w-2" />
          <ScreenSettings
            activeScreen={localMobileScreen} // Оставляем локальный экран для плавной анимации закрытия
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
