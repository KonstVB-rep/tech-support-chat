import type React from "react"
import { Suspense } from "react"
import { MobileNavWrapper } from "@/widgets/mobile-nav/MobileNavWrapper"
import { SidebarNavWrapper } from "@/widgets/sidebar/ui/SidebarNavWrapper"

interface PageLayoutProps {
  children: React.ReactNode
}

const PageLayout = async ({ children }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex h-full">
        <Suspense fallback={<SidebarNavSkeleton />}>
          <SidebarNavWrapper />
        </Suspense>
      </div>

      <div className="flex max-h-[calc(100dvh-80px)] w-full flex-col overflow-hidden md:max-h-none md:flex-row">
        {children}
        <Suspense fallback={<LinksListNavSkeleton />}>
          <MobileNavWrapper />
        </Suspense>
      </div>
    </div>
  )
}

export default PageLayout

const SidebarNavSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-2 p-2">
      <div className="h-12 w-12 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
      <div className="h-12 w-12 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
      <div className="h-12 w-12 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
      <div className="h-12 w-12 animate-pulse rounded-md bg-zinc-100 dark:bg-zinc-800" />
    </div>
  )
}

const LinksListNavSkeleton = () => {
  return (
    <nav className="fixed bottom-0 z-50 flex w-full animate-pulse select-none justify-center gap-2 border-none bg-background px-1 py-3 shadow-[0_0_20px_0_#00000030] md:hidden dark:shadow-[0_0_20px_0_#000000]">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          className="flex max-w-[80px] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1"
          key={i}
        >
          <div className="h-5 w-5 shrink-0 rounded-md bg-muted" />
          <div className="mt-0.5 h-3 w-12 rounded-sm bg-muted" />
        </div>
      ))}
    </nav>
  )
}
