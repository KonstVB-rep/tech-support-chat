// src/entities/organization/ui/OrganizationMembersDrawer.tsx
"use client";

import { Button } from "@/shared/ui/button";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import { Users } from "lucide-react";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const OrganizationMembersDrawer = ({ children }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <DrawerComponent
      trigger={
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
          <Users className="size-3.5" />
          Участники
        </Button>
      }
      side={isDesktop ? "right" : "bottom"}
      className={cn(
        "px-3",
        isDesktop
          ? "data-[vaul-drawer-direction=right]:sm:!max-w-3xl"
          : "data-[vaul-drawer-direction=bottom]:max-h-[90vh]",
      )}
    >
      <div className="p-4 space-y-4 h-full">{children}</div>
    </DrawerComponent>
  );
};
