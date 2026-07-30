"use client"

import { useState } from "react"
import type { OrganizationWithCounts } from "@/entities/organization"
import { Input } from "@/shared/ui/components/input"
import OrganizationCardMobile from "./OrganizationCardMobile"

type OrganizationsListProps = {
  organizations: OrganizationWithCounts[]
}

const OrganizationListMobile = ({ organizations }: OrganizationsListProps) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = organizations.filter((org) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return org.name?.toLowerCase().includes(query) || org.inn?.toLowerCase().includes(query)
  })

  return (
    <div className="flex max-h-[81dvh] flex-col overflow-y-auto md:hidden">
      <div className="sticky top-0 z-10 border-b bg-background p-4 pb-2">
        <Input
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию или ИНН..."
          value={searchQuery}
        />
      </div>

      <div className="grid gap-4 p-4">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-sm">Ничего не найдено</div>
        ) : (
          filtered.map((org) => <OrganizationCardMobile data={org} key={org.id} />)
        )}
      </div>
    </div>
  )
}

export default OrganizationListMobile
