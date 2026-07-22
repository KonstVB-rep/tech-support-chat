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
