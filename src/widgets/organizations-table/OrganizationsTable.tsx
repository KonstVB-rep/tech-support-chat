// src/widgets/organizations-table/ui/OrganizationsTable.tsx
"use client";


import { DataTable } from "@/shared/ui/custom/DataTable";
import { columns } from "./columns"; 
import type { OrganizationWithCounts } from "@/entities/organization";

interface OrganizationsTableProps {
  data: OrganizationWithCounts[]; // 🎯 ИСПРАВЛЕНО: Строгий массив с каунтерами
}

export const OrganizationsTable = ({ data }: OrganizationsTableProps) => {
  return (
    <div className="w-full h-full border border-border/40 rounded-xl bg-background/50 overflow-y-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
};
