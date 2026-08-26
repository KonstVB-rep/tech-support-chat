import { OrgRole } from "@prisma/client"
import Link from "next/link"
import type { NavigationLink } from "@/shared/constants"
import { useCurrentMemberRole } from "@/store/useChatStore"

type LinksListNavProps<T> = {
  isAdmin: boolean
  data: T[]
  linkClass: (href: string) => string
}

export const LinksListNav = <T extends NavigationLink>({
  isAdmin,
  data,
  linkClass,
}: LinksListNavProps<T>) => {
  const currentMemberRole = useCurrentMemberRole()

  const visibleLinks = data.filter((link) => {
    if (link.isAdminOnly && !isAdmin) return null

    if (link.isResponsibleOnly) {
      return currentMemberRole === OrgRole.RESPONSIBLE
    }

    return true
  })
  return (
    <>
      {visibleLinks.map((link) => {
        return (
          <Link className={linkClass(link.href)} href={link.href} key={link.href}>
            {link.icon}
            <span className="text-xs">{link.title}</span>
          </Link>
        )
      })}
    </>
  )
}
