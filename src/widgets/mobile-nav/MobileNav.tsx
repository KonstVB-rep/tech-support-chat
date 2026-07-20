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
        ? "text-blue-500 font-medium hover:bg-muted/50"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    );

  return (
    <div className="fixed bottom-0 w-full z-50 flex bg-background gap-2 justify-center py-4 px-1 border-none">
      <LinksListNav isAdmin={isAdmin} data={LINKS_NAV} linkClass={linkClass} />
    </div>
  );
};

export default MobileNav;
