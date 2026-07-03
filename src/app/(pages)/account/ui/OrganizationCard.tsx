"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import type { Organization } from "@prisma/client";

interface OrganizationCardProps {
  organization: Organization;
}

export const OrganizationCard = ({ organization }: OrganizationCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU").format(new Date(date));
  };

  return (
    <Card className="w-full mx-auto max-w-lg min-w-2xs h-fit bg-transparent shadow-none ring-0">
      <CardHeader>
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