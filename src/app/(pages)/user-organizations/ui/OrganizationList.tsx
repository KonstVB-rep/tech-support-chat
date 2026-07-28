import { Building2, CalendarRange, Clock, FileText, Users } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { OrganizationMembership } from "@/entities/profile/types";
import { OrgRole } from "@prisma/client";
import { OrganizationMembersDrawer } from "@/entities/organization";
import {
  OrganizationMembersContent,
  OrganizationMembersContentMobile,
} from "@/widgets/employee/ui/OrganizationMembersContent";
import { Suspense } from "react";

interface OrganizationListProps {
  organizations: OrganizationMembership[];
}

export const OrganizationList = ({ organizations }: OrganizationListProps) => {
  if (organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Building2 className="size-12 mb-3 opacity-40" />
        <p className="text-sm font-medium">Нет доступных организаций</p>
      </div>
    );
  }

  return (
    <div className="grid w-full mt-4 gap-4 md:gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] overflow-y-auto p-4">
      {organizations.map((org) => {
        const { organization } = org;

        return (
          <div
            key={org.id}
            className={cn(
              "group relative flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-all duration-200",
              "hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Building2 className="size-5" />
                </div>
                <h3 className="truncate text-base font-semibold leading-tight text-foreground">
                  {organization.name}
                </h3>
              </div>
              {org.role && (
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {org.role === OrgRole.RESPONSIBLE
                    ? "Ответственное лицо"
                    : "Сотрудник"}
                </span>
              )}
            </div>

            <div className="h-px w-full bg-border/60" />

            <div className="flex gap-4">
              <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 shrink-0 opacity-60" />
                  <span className="truncate">
                    <span className="font-medium text-foreground/80">
                      Договор:
                    </span>{" "}
                    {organization.contractNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CalendarRange className="size-4 shrink-0 opacity-60" />
                  <span className="truncate">
                    <span className="font-medium text-foreground/80">
                      Срок:
                    </span>{" "}
                    {new Intl.DateTimeFormat("ru").format(
                      organization.contractStart,
                    )}{" "}
                    –{" "}
                    {new Intl.DateTimeFormat("ru").format(
                      organization.contractEnd,
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="size-4 shrink-0 opacity-60" />
                  <span>
                    <span className="font-medium text-foreground/80">
                      Поддержка:
                    </span>{" "}
                    {organization.timeSupportFrom} –{" "}
                    {organization.timeSupportTo}
                  </span>
                </div>
              </div>

              <OrganizationMembersContent organizationId={organization.id} />
            </div>

            <div className="mt-auto h-10 border-t border-border/40">
              <div className="flex items-center justify-between pt-3 md:hidden">
                {org.position && (
                  <span className="text-xs text-muted-foreground/70">
                    Должность:{" "}
                    <span className="font-medium text-foreground/60">
                      {org.position}
                    </span>
                  </span>
                )}

                <OrganizationMembersDrawer>
                  <Suspense fallback={<EmployeesSkeleton />}>
                    <OrganizationMembersContentMobile
                      organizationId={organization.id}
                    />
                  </Suspense>
                </OrganizationMembersDrawer>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const EmployeesSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 rounded-lg bg-muted" />
      ))}
    </div>
  );
};
