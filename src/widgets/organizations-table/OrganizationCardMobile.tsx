"use client"
import Link from "next/link"
import type { OrganizationWithCounts } from "@/entities/organization"
import { DeleteOrganizationDialog } from "@/features/manage-organization"

type OrganizationCardProps = {
  data: OrganizationWithCounts
}

const OrganizationCardMobile = ({ data }: OrganizationCardProps) => {
  return (
    <div className="grid w-full overflow-hidden rounded-xl bg-muted">
      <div className="relative">
        <Link className="absolute inset-0 active:bg-white/20" href={`/organization/${data.id}`} />

        <div className="grid gap-1 border-b bg-zinc-300 p-4 text-center dark:bg-zinc-800">
          <span>{data.name}</span>
          <span>ИНН:{data.inn}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="grid gap-1 rounded-xl p-2">
            <span className="text-ring">Номер договора:</span>
            <span>{data.contractNumber}</span>
            <span className="text-ring">Время поддержки:</span>
            <span>
              {data.timeSupportFrom} - {data.timeSupportTo}
            </span>
          </div>
          <div className="grid content-baseline rounded-xl p-2">
            <span className="text-ring">Срок договора:</span>
            <span>
              {Intl.DateTimeFormat("ru").format(data.contractStart)} -{" "}
              {Intl.DateTimeFormat("ru").format(data.contractEnd)}
            </span>
          </div>
        </div>
        {data.description && (
          <div className="grid rounded-xl p-2">
            <span className="text-ring">Описание:</span>
            <span className="whitespace-pre-wrap break-words">{data.description}</span>
          </div>
        )}

        <div className="grid gap-2 rounded-xl p-2">
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
          className="field-hight flex w-full items-center justify-start gap-2"
          ids={data.id}
          organizationName={data.name}
        />
      </div>
    </div>
  )
}

export default OrganizationCardMobile
