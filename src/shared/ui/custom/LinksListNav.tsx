import { NavigationLink } from "@/shared/constants";
import Link from "next/link";
import React from "react";

import { OrgRole } from "@prisma/client";
import { useCurrentMemberRole } from "@/store/useChatStore";

type LinksListNavProps<T> = {
  isAdmin: boolean;
  data: T[];
  linkClass: (href: string) => string;
};

export const LinksListNav = <T extends NavigationLink>({
  isAdmin,
  data,
  linkClass,
}: LinksListNavProps<T>) => {
  const currentMemberRole = useCurrentMemberRole();

  const visibleLinks = data.filter((link) => {
    if (link.isAdminOnly && !isAdmin) return null;

    if (link.isResponsibleOnly) {
      return currentMemberRole === OrgRole.RESPONSIBLE;
    }

    return true;
  });
  return (
    <>
      {visibleLinks.map((link) => {
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
    </>
  );
};
