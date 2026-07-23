"use client";

import { ActiveScreenKeys } from "@/features/update-account-info/model/constants";
import { Button } from "@/shared/ui/button";
import {
  ChevronRight,
  LaptopMinimalCheck,
  PaintbrushVertical,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut";

interface SidebarProfileListProps {
  setActiveScreen: (screen: ActiveScreenKeys) => void;
}

export const SidebarProfileList = ({
  setActiveScreen,
}: SidebarProfileListProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = (e.target as HTMLElement).closest("[data-screen]");

    if (button instanceof HTMLElement) {
      const screen = button.dataset.screen as ActiveScreenKeys;
      if (screen) {
        console.log(`⌨️ Переключение экрана настроек PWA на: ${screen}`);

        const params = new URLSearchParams(searchParams.toString());
        params.set("screen", screen);
        router.replace(`?${params.toString()}`);

        setActiveScreen(screen);
      }
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="flex-1 w-full p-3 overflow-y-auto space-y-2 select-none"
    >
      <Button
        data-screen="profile"
        className="flex items-center justify-start flex-1 w-full h-10 p-3"
        variant="outline"
      >
        <span className="w-full text-sm font-semibold flex items-center justify-start gap-2">
          <User className="h-4 w-4 text-muted-foreground" /> Профиль
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Button
        data-screen="session"
        className="flex items-center justify-start flex-1 w-full h-10 p-3"
        variant="outline"
      >
        <span className="w-full text-sm font-semibold flex items-center justify-start gap-2">
          <LaptopMinimalCheck className="h-4 w-4 text-muted-foreground" />{" "}
          Сессия
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Button
        data-screen="decoration"
        className="flex items-center justify-start flex-1 w-full h-10 p-3"
        variant="outline"
      >
        <span className="w-full text-sm font-semibold flex items-center justify-start gap-2">
          <PaintbrushVertical className="h-4 w-4 text-muted-foreground" />{" "}
          Оформление
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Button
        data-screen="accountDel"
        className="flex items-center justify-start flex-1 w-full h-10 p-3 hover:text-destructive hover:bg-destructive/5"
        variant="destructive"
      >
        <span className="w-full text-sm font-semibold flex items-center justify-start text-white">
          Удалить аккаунт
        </span>
        <ChevronRight className="h-4 w-4" />
      </Button>

      <ButtonSignOut
        className="flex w-full field-height var gap-1 items-center justify-center p-2 rounded-xl select-none transition-colors mx-auto hover:bg-muted/50 hover:text-foreground"
        withIcon={true}
        withText={true}
      />
    </div>
  );
};
