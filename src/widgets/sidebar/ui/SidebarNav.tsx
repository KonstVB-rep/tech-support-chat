"use client"

import { OrgRole } from "@prisma/client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut"
import { LINKS_NAV } from "@/shared/constants"
import { cn } from "@/shared/lib/utils"
import { SharedLayoutBg } from "@/shared/ui/components/motion/shared-layout-bg"
import { useCurrentMemberRole } from "@/store/useChatStore"

interface SidebarNavProps {
  isAdmin: boolean
}

export const SidebarNav = ({ isAdmin }: SidebarNavProps) => {
  const pathname = usePathname()

  const currentMemberRole = useCurrentMemberRole()

  const isActive = (href: string) => pathname.startsWith(href)

  const linkClass = (href: string) =>
    cn(
      "flex h-auto w-full select-none flex-col items-center justify-start gap-1 rounded-xl p-2 transition-colors",
      isActive(href)
        ? "bg-primary/10 font-medium text-primary"
        : "text-muted-foreground hover:bg-muted/50 :hover:text-blue-700 dark:hover:text-foreground",
    )

  const visibleLinks = LINKS_NAV.filter((link) => {
    if (link.isAdminOnly && !isAdmin) return null

    if (link.isResponsibleOnly) {
      return currentMemberRole === OrgRole.RESPONSIBLE
    }

    return true
  })

  return (
    <div className="hidden h-full flex-col justify-start gap-2 border-none bg-primary-foreground px-1 py-3 md:flex">
      <div className="grid flex-1 gap-2">
        <SharedLayoutBg
          className="h-full justify-between gap-2 p-1"
          classNameChild="flex flex-col gap-2 items-center justify-bettwen"
          inset={0}
        >
          <div>
            {visibleLinks.map((link) => {
              if (link.isAdminOnly && !isAdmin) return null

              return (
                <Link className={linkClass(link.href)} href={link.href} key={link.href}>
                  {link.icon}
                  <span className="text-center text-xs">{link.title}</span>
                </Link>
              )
            })}
          </div>
          <ButtonSignOut
            className="mx-auto flex h-auto w-full select-none flex-col items-center justify-start gap-1 rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            variant="ghost"
            withIcon={true}
            withText={true}
          />
        </SharedLayoutBg>
      </div>
    </div>
  )
}
