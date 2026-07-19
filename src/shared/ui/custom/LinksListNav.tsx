import Link from "next/link";
import React from "react";

type LinksListNavProps<T> = {
  isAdmin: boolean;
  data: T[];
  linkClass: (href: string) => string;
};

export const LinksListNav = <
  T extends {
    href: string;
    title: string;
    icon: React.ReactNode;
    isAdminOnly?: boolean;
  },
>({
  isAdmin,
  data,
  linkClass,
}: LinksListNavProps<T>) => {
  return (
    <>
      {data.map((link) => {
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
    </>
  );
};
