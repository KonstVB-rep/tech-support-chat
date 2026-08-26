"use client"

import { type Organization, OrgRole } from "@prisma/client"
import { Eye } from "lucide-react"
import Link from "next/link"
import { useGetCurrentMemberRole } from "@/entities/employee/api/useGetCurrentMemberRole"
import { USER_ROLE } from "@/shared/constants"
import { useCurrentUser } from "@/shared/lib/hooks/useCurrentUser"
import { ProtectByRole } from "@/shared/lib/ProtectByRole"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/card"

interface OrganizationCardProps {
  organization: Organization
}

export const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  const dataUser = useCurrentUser()

  const currentMemberRole = useGetCurrentMemberRole(organization.id)
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU").format(new Date(date))
  }

  return (
    <Card className="relative mx-auto h-fit w-full min-w-2xs max-w-lg overflow-visible bg-muted p-4 not-visited:shadow-none ring-0">
      <CardHeader>
        <ProtectByRole
          currentMemberRole={currentMemberRole}
          requiredOrgRole={OrgRole.RESPONSIBLE}
          requiredRole={dataUser?.role === USER_ROLE.ADMIN ? USER_ROLE.ADMIN : USER_ROLE.USER}
        >
          <Link
            className="-top-2 -left-2 absolute rounded-full border bg-chart-3 p-2"
            href={`/organization/${organization.id}`}
            title="Подробнее"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </ProtectByRole>
        <CardTitle className="text-center uppercase">{organization.name}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Адрес */}
          <div className="space-y-1">
            <div className="font-medium text-muted-foreground text-sm">Адрес</div>
            <div className="text-base">{organization.legalAddress}</div>
          </div>

          {/* ИНН */}
          <div className="space-y-1">
            <div className="font-medium text-muted-foreground text-sm">ИНН</div>
            <div className="text-base">{organization.inn}</div>
          </div>

          {/* Номер договора */}
          <div className="space-y-1">
            <div className="font-medium text-muted-foreground text-sm">Номер договора</div>
            <div className="text-base">{organization.contractNumber}</div>
          </div>

          <div className="space-y-1">
            <div className="font-medium text-muted-foreground text-sm">Время поддержки</div>
            <div className="text-base">
              с {organization.timeSupportFrom} - до {organization.timeSupportTo}
            </div>
          </div>

          {/* Даты договоров */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <div className="font-medium text-muted-foreground text-sm">Дата начала договора</div>
              <div className="text-base">{formatDate(organization.contractStart)}</div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="font-medium text-muted-foreground text-sm">
                Дата окончания договора
              </div>
              <div className="text-base">{formatDate(organization.contractEnd)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
