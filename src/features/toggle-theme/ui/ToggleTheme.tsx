"use client";

import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/motion/tabs";
import { useTheme } from "next-themes";

export const ToggleTheme = () => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Section title="Тема">
        <Tabs defaultValue={theme} variant="pill" onValueChange={setTheme}>
          <TabsList className="w-full flex border">
            <TabsTrigger
              value="system"
              classNameWrapper="flex-1 flex items-center justify-center"
            >
              Системная
            </TabsTrigger>
            <TabsTrigger
              value="light"
              classNameWrapper="flex-1 flex items-center justify-center"
            >
              Светлая
            </TabsTrigger>
            <TabsTrigger
              value="dark"
              classNameWrapper="flex-1 flex items-center justify-center"
            >
              Темная
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Section>
    </div>
  );
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
      {children}
    </div>
  );
}

export const ToggleThemeSkeleton = () => {
  return (
    <div className="flex w-full max-w-md flex-col gap-8 animate-pulse select-none">
      <div className="flex flex-col gap-2">
        {/* Имитация заголовка секции "Тема" с идентичным трекингом */}
        <div className="h-4 w-12 bg-muted rounded-md tracking-wider" />

        {/* Внешний контейнер табов с фиксированной высотой (высота стандартного TabsList) */}
        <div className="w-full h-9 bg-card/20 rounded-xl border border-border/40 flex p-1 gap-1 items-center">
          {/* Имитация вкладки "Системная" */}
          <div className="flex-1 h-full bg-muted/60 rounded-lg" />
          {/* Имитация вкладки "Светлая" */}
          <div className="flex-1 h-full bg-muted/30 rounded-lg" />
          {/* Имитация вкладки "Темная" */}
          <div className="flex-1 h-full bg-muted/30 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
