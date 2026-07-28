"use client";

import { useGetCurrentMemberRole } from "@/entities/employee/api/useGetCurrentMemberRole";
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut";
import { LINKS_NAV } from "@/shared/constants";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { cn } from "@/shared/lib/utils";
import { SharedLayoutBg } from "@/shared/ui/motion/shared-layout-bg";
import { useCurrentMemberRole } from "@/store/useChatStore";
import { OrgRole } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  isAdmin: boolean;
}

export const SidebarNav = ({ isAdmin }: SidebarNavProps) => {
  const pathname = usePathname();

  const isDekstop = useMediaQuery("(min-width: 768px)");

  const currentMemberRole = useCurrentMemberRole();

  const isActive = (href: string) => pathname.startsWith(href);

  const linkClass = (href: string) =>
    cn(
      "flex flex-col w-full gap-1 items-center justify-start h-auto p-2 rounded-xl transition-colors select-none",
      isActive(href)
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground hover:bg-muted/50 dark:hover:text-foreground :hover:text-blue-700",
    );

  if (!isDekstop) return null;

  const visibleLinks = LINKS_NAV.filter((link) => {
    if (link.isAdminOnly && !isAdmin) return null;

    if (link.isResponsibleOnly) {
      return currentMemberRole === OrgRole.RESPONSIBLE;
    }

    return true;
  });

  return (
    <>
      <div className="hidden md:flex flex-col bg-primary-foreground gap-2 h-full justify-start py-3 px-1 border-none">
        <div className="grid gap-2 flex-1">
          <SharedLayoutBg
            inset={0}
            classNameChild="flex flex-col gap-2 items-center justify-bettwen"
            className="gap-2 h-full justify-between p-1"
          >
            <div>
              {visibleLinks.map((link) => {
                if (link.isAdminOnly && !isAdmin) return null;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={linkClass(link.href)}
                  >
                    {link.icon}
                    <span className="text-xs text-center">{link.title}</span>
                  </Link>
                );
              })}
            </div>
            <ButtonSignOut
              variant="ghost"
              className="w-full flex flex-col gap-1 items-center justify-start h-auto p-2 rounded-xl select-none transition-colors mx-auto text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              withIcon={true}
              withText={true}
            />
          </SharedLayoutBg>
        </div>
      </div>
    </>
  );
};
