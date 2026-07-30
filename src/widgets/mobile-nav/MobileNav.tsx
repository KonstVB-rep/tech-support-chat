"use client"

import { usePathname } from "next/navigation"
import { LINKS_NAV } from "@/shared/constants"
import { cn } from "@/shared/lib/utils"
import { LinksListNav } from "@/shared/ui/custom/LinksListNav"

const MobileNav = ({ isAdmin }: { isAdmin: boolean }) => {
  const pathname = usePathname()

  const isActive = (href: string) => pathname.startsWith(href)

  const linkClass = (href: string) =>
    cn(
      "flex h-auto flex-1 shrink-0 select-none flex-col items-center justify-center gap-1 rounded-full p-2 transition-colors",
      isActive(href)
        ? "font-medium text-blue-500 hover:bg-chart-1 active:bg-chart-1 dark:active:bg-chart-5 dark:focus-visible:bg-chart-5 dark:hover:bg-chart-5"
        : "text-muted-foreground hover:bg-chart-1 active:bg-chart-1 dark:active:bg-chart-5 dark:hover:bg-chart-5 dark:hover:text-foreground",
    )

  return (
    <nav className="fixed bottom-0 z-50 flex w-full justify-center gap-2 border-none bg-background px-1 py-3 shadow-[0_0_20px_0_#00000030] md:hidden dark:shadow-[0_0_20px_0_#000000]">
      <LinksListNav data={LINKS_NAV} isAdmin={isAdmin} linkClass={linkClass} />
    </nav>
  )
}

export default MobileNav
