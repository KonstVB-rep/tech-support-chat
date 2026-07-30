"use client"

import { useTheme } from "next-themes"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/components/motion/tabs"

export const ToggleTheme = () => {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Section title="Тема">
        <Tabs defaultValue={theme} onValueChange={setTheme} variant="pill">
          <TabsList className="flex w-full border">
            <TabsTrigger classNameWrapper="flex-1 flex items-center justify-center" value="system">
              Системная
            </TabsTrigger>

            <TabsTrigger classNameWrapper="flex-1 flex items-center justify-center" value="light">
              Светлая
            </TabsTrigger>

            <TabsTrigger classNameWrapper="flex-1 flex items-center justify-center" value="dark">
              Темная
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
      {children}
    </div>
  )
}

export const ToggleThemeSkeleton = () => {
  return (
    <div className="flex w-full max-w-md animate-pulse select-none flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-12 rounded-md bg-muted tracking-wider" />

        <div className="flex h-9 w-full items-center gap-1 rounded-xl border border-border/40 bg-card/20 p-1">
          <div className="h-full flex-1 rounded-lg bg-muted/60" />

          <div className="h-full flex-1 rounded-lg bg-muted/30" />

          <div className="h-full flex-1 rounded-lg bg-muted/30" />
        </div>
      </div>
    </div>
  )
}
