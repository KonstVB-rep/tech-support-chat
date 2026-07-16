"use client";

import { ChevronRight, LaptopMinimalCheck, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

interface SidebarProfileListProps {
  setActiveScreen: React.Dispatch<React.SetStateAction<string>>;
}

export const SidebarProfileList = ({ setActiveScreen }: SidebarProfileListProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const screen = searchParams.get("screen");
      setActiveScreen(screen ? screen : "profile");
  }, [searchParams, setActiveScreen]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = (e.target as HTMLElement).closest("[data-screen]");

    if (button instanceof HTMLElement) {
      const screen = button.dataset.screen;
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
          <LaptopMinimalCheck className="h-4 w-4 text-muted-foreground" /> Сессия
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Button
        data-screen="accountDel"
        className="flex items-center justify-start flex-1 w-full h-10 p-3 hover:text-destructive hover:bg-destructive/5"
        variant="destructive"
      >
        <span className="w-full text-sm font-semibold flex items-center justify-start">
          Удалить аккаунт
        </span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};