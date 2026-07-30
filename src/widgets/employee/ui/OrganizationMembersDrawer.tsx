// src/entities/organization/ui/OrganizationMembersDrawer.tsx
"use client"

import type { ReactNode } from "react"
import { Users } from "lucide-react"
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/components/button"
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent"

interface Props {
  children: ReactNode
}

export const OrganizationMembersDrawer = ({ children }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <DrawerComponent
      className={cn(
        "px-3",
        isDesktop
          ? "data-[vaul-drawer-direction=right]:sm:!max-w-3xl"
          : "data-[vaul-drawer-direction=bottom]:max-h-[90vh]",
      )}
      side={isDesktop ? "right" : "bottom"}
      trigger={
        <Button className="h-8 gap-1.5 text-xs" size="sm" variant="ghost">
          <Users className="size-3.5" />
          Участники
        </Button>
      }
    >
      <div className="h-full space-y-4 p-4">{children}</div>
    </DrawerComponent>
  )
}
