"use client";

import { OrganizationWithCounts } from "@/entities/organization";
import OrganizationCardMobile from "./OrganizationCardMobile";
import { Input } from "@/shared/ui/input";
import { useState } from "react";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";

type OrganizationsListProps = {
  organizations: OrganizationWithCounts[];
};

const OrganizationListMobile = ({ organizations }: OrganizationsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) return null;

  const filtered = organizations.filter((org) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      org.name?.toLowerCase().includes(query) ||
      org.inn?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-h-[81dvh] overflow-y-auto flex flex-col">
      <div className="sticky top-0 z-10 bg-background p-4 pb-2 border-b">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по названию или ИНН..."
        />
      </div>

      <div className="grid gap-4 p-4">
        {filtered.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            Ничего не найдено
          </div>
        ) : (
          filtered.map((org) => (
            <OrganizationCardMobile key={org.id} data={org} />
          ))
        )}
      </div>
    </div>
  );
};

export default OrganizationListMobile;
