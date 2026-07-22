"use client";

import { LINKS_NAV } from "@/shared/constants";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { cn } from "@/shared/lib/utils";
import { LinksListNav } from "@/shared/ui/custom/LinksListNav";

import { usePathname } from "next/navigation";

const MobileNav = ({ isAdmin }: { isAdmin: boolean }) => {
  const pathname = usePathname();

  const isNotDekstop = useMediaQuery("(max-width: 767px)");

  if (!isNotDekstop) return null;

  const isActive = (href: string) => pathname.startsWith(href);

  const linkClass = (href: string) =>
    cn(
      "flex flex-1 flex-col gap-1 items-center justify-center h-auto p-2 rounded-full transition-colors select-none shrink-0",
      isActive(href)
        ? "text-blue-500 font-medium dark:hover:bg-chart-5 dark:active:bg-chart-5 dark:focus-visible:bg-chart-5 active:bg-chart-1 hover:bg-chart-1"
        : "text-muted-foreground dark:hover:bg-chart-5 dark:hover:text-foreground dark:active:bg-chart-5 active:bg-chart-1 hover:bg-chart-1",
    );

  return (
    <nav className="fixed bottom-0 w-full z-50 flex bg-background gap-2 justify-center py-3 px-1 border-none dark:shadow-[0_0_20px_0_#000000] shadow-[0_0_20px_0_#00000030]">
      <LinksListNav isAdmin={isAdmin} data={LINKS_NAV} linkClass={linkClass} />
    </nav>
  );
};

export default MobileNav;
