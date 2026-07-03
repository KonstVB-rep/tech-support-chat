"use client";


import { DataTable } from "@/shared/ui/custom/DataTable";
import { columns } from "./columns";
import { SupportEngineerWithProfile } from "@/entities/support-engineer";

export const SupportEngineersTable = ({data}: {data: SupportEngineerWithProfile[]}) => {

  return <DataTable columns={columns} data={data ?? []} />;
};