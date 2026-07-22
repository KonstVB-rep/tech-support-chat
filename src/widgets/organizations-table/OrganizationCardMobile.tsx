"use client";
import { OrganizationWithCounts } from "@/entities/organization";
import { DeleteOrganizationDialog } from "@/features/manage-organization";
import Link from "next/link";

type OrganizationCardProps = {
  data: OrganizationWithCounts;
};

const OrganizationCardMobile = ({ data }: OrganizationCardProps) => {
  return (
    <div className="w-full bg-muted grid rounded-xl overflow-hidden">
      <div className="relative">
        <Link
          href={`/organization/${data.id}`}
          className="absolute inset-0 active:bg-white/20"
        />

        <div className="p-4 text-center grid gap-1 border-b dark:bg-zinc-800 bg-zinc-300">
          <span>{data.name}</span>
          <span>ИНН:{data.inn}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 grid gap-1 rounded-xl">
            <span className="text-ring">Номер договора:</span>
            <span>{data.contractNumber}</span>
            <span className="text-ring">Время поддержки:</span>
            <span>
              {data.timeSupportFrom} - {data.timeSupportTo}
            </span>
          </div>
          <div className="p-2 grid rounded-xl content-baseline">
            <span className="text-ring">Срок договора:</span>
            <span>
              {Intl.DateTimeFormat("ru").format(data.contractStart)} -{" "}
              {Intl.DateTimeFormat("ru").format(data.contractEnd)}
            </span>
          </div>
        </div>
        {data.description && (
          <div className="p-2 grid rounded-xl">
            <span className="text-ring">Описание:</span>
            <span className="break-words whitespace-pre-wrap">
              {data.description}
            </span>
          </div>
        )}

        <div className="p-2 grid gap-2 rounded-xl">
          {data.actualAddress && (
            <div className="grid place-items-center">
              <span className="text-ring">Адрес фактический:</span>
              <span>{data.actualAddress}</span>
            </div>
          )}
          <div className="grid place-items-center">
            <span className="text-ring">Адрес юридический:</span>
            <span>{data.legalAddress}</span>
          </div>
        </div>
      </div>
      <div className="border-t px-3 py-2">
        <DeleteOrganizationDialog
          ids={data.id}
          organizationName={data.name}
          className="w-full field-height"
        />
      </div>
    </div>
  );
};

export default OrganizationCardMobile;
