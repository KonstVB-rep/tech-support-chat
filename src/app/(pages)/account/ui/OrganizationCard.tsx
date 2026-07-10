"use client";

import { useGetCurrentMemberRole } from "@/entities/employee/api/useGetCurrentMemberRole";

import { USER_ROLE } from "@/shared/constants";
import { ProtectByRole } from "@/shared/lib/ProtectByRole";
import { useCurrentUser } from "@/shared/lib/hooks/useCurrentUser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { OrgRole, type Organization } from "@prisma/client";
import { Eye } from "lucide-react";
import Link from "next/link";

interface OrganizationCardProps {
  organization: Organization;
}

export const OrganizationCard = ({ organization }: OrganizationCardProps) => {

  const dataUser = useCurrentUser();

  const currentMemberRole = useGetCurrentMemberRole(organization.id);
;
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU").format(new Date(date));
  };

  return (
    <Card className="relative w-full mx-auto max-w-lg min-w-2xs h-fit not-visited:shadow-none ring-0 p-2 bg-muted overflow-visible">
      <CardHeader>
        <ProtectByRole requiredOrgRole={OrgRole.RESPONSIBLE} requiredRole={dataUser?.role === USER_ROLE.ADMIN ? USER_ROLE.ADMIN : USER_ROLE.USER}  currentMemberRole={currentMemberRole}>
          <Link href={`/organization/${organization.id}`} className="absolute -top-2 -left-2 p-2 border rounded-full bg-chart-3" title="Подробнее">
            <Eye className="h-5 w-5" />
          </Link>
        </ProtectByRole>
        <CardTitle className="text-center uppercase">Карточка компании</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Название */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              Название
            </div>
            <div className="text-base">
              {organization.name}
            </div>
          </div>

          {/* Адрес */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              Адрес
            </div>
            <div className="text-base">
              {organization.legalAddress}
            </div>
          </div>

          {/* ИНН */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              ИНН
            </div>
            <div className="text-base">
              {organization.inn}
            </div>
          </div>

          {/* Номер договора */}
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              Номер договора
            </div>
            <div className="text-base">
              {organization.contractNumber}
            </div>
          </div>

           <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
              Время поддержки
            </div>
            <div className="text-base">
              с {organization.timeSupportFrom} - до {organization.timeSupportTo}
            </div>
          </div>

          {/* Даты договоров */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Дата начала договора
              </div>
              <div className="text-base">
                {formatDate(organization.contractStart)}
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="text-sm font-medium text-muted-foreground">
                Дата окончания договора
              </div>
              <div className="text-base">
                {formatDate(organization.contractEnd)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};