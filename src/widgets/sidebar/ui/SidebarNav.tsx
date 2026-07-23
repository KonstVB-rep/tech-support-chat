"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { LINKS_NAV } from "@/shared/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { TextAlignJustify } from "lucide-react";
import { SharedLayoutBg } from "@/shared/ui/motion/shared-layout-bg";
import Link from "next/link";
import { useGetCurrentMemberRole } from "@/entities/employee/api/useGetCurrentMemberRole";
import { OrgRole } from "@prisma/client";

interface SidebarNavProps {
  isAdmin: boolean;
}

export const SidebarNav = ({ isAdmin }: SidebarNavProps) => {
  const pathname = usePathname();

  const isDekstop = useMediaQuery("(min-width: 768px)");

  const currentMemberRole = useGetCurrentMemberRole();

  const isActive = (href: string) => pathname.startsWith(href);

  const linkClass = (href: string) =>
    cn(
      "flex gap-1 items-center justify-start h-auto p-2 rounded-xl transition-colors select-none",
      isActive(href)
        ? "bg-primary/10 text-primary font-medium"
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
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
    <div className="flex flex-col bg-primary-foreground gap-2 h-full justify-between py-3 px-1 border-none">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="bg-transparent border-none shadow-none"
          >
            <TextAlignJustify />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start">
          <div className="grid gap-2">
            <SharedLayoutBg
              inset={0}
              classNameChild="flex gap-2 items-center justify-start"
              className="gap-2"
            >
              {visibleLinks.map((link) => {
                if (link.isAdminOnly && !isAdmin) return null;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={linkClass(link.href)}
                  >
                    {link.icon}
                    <span className="text-xs">{link.title}</span>
                  </Link>
                );
              })}
            </SharedLayoutBg>
          </div>
          <DropdownMenuSeparator />
          <ButtonSignOut
            variant="ghost"
            className="w-full flex gap-1 items-center justify-start h-auto p-2 rounded-xl select-none transition-colors mx-auto text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            withIcon={true}
            withText={true}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
