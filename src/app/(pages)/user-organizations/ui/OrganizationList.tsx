import { Suspense } from "react"
import { OrgRole } from "@prisma/client"
import { Building2, CalendarRange, Clock, FileText } from "lucide-react"
import { OrganizationMembersDrawer } from "@/entities/organization"
import type { OrganizationMembership } from "@/entities/profile/types"
import { AddEmployeeDialog } from "@/features/manage-employee"
import { cn } from "@/shared/lib/utils"
import {
  OrganizationMembersContent,
  OrganizationMembersContentMobile,
} from "@/widgets/employee/ui/OrganizationMembersContent"

interface OrganizationListProps {
  organizations: OrganizationMembership[]
}

export const OrganizationList = ({ organizations }: OrganizationListProps) => {
  if (organizations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Building2 className="mb-3 size-12 opacity-40" />
        <p className="font-medium text-sm">Нет доступных организаций</p>
      </div>
    )
  }

  return (
    <div className="mt-4 grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4 overflow-y-auto p-4 md:gap-6">
      {organizations.map((org) => {
        const { organization } = org

        return (
          <div
            className={cn(
              "group relative flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
            key={org.id}
          >
            <div className="ml-auto">
              <AddEmployeeDialog organizationId={org.id} />
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Building2 className="size-5" />
                </div>
                <h3 className="truncate font-semibold text-base text-foreground leading-tight">
                  {organization.name}
                </h3>
              </div>
              {org.role && (
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
                  {org.role === OrgRole.RESPONSIBLE ? "Ответственное лицо" : "Сотрудник"}
                </span>
              )}
            </div>

            <div className="h-px w-full bg-border/60" />

            <div className="flex gap-4">
              <div className="flex flex-col gap-2.5 text-muted-foreground text-sm">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 shrink-0 opacity-60" />
                  <span className="truncate">
                    <span className="font-medium text-foreground/80">Договор:</span>{" "}
                    {organization.contractNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CalendarRange className="size-4 shrink-0 opacity-60" />
                  <span className="truncate">
                    <span className="font-medium text-foreground/80">Срок:</span>{" "}
                    {new Intl.DateTimeFormat("ru").format(organization.contractStart)} –{" "}
                    {new Intl.DateTimeFormat("ru").format(organization.contractEnd)}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="size-4 shrink-0 opacity-60" />
                  <span>
                    <span className="font-medium text-foreground/80">Поддержка:</span>{" "}
                    {organization.timeSupportFrom} – {organization.timeSupportTo}
                  </span>
                </div>
              </div>

              <OrganizationMembersContent organizationId={organization.id} />
            </div>

            <div className="mt-auto h-10 border-border/40 border-t">
              <div className="flex items-center justify-between pt-3 md:hidden">
                {org.position && (
                  <span className="text-muted-foreground/70 text-xs">
                    Должность:{" "}
                    <span className="font-medium text-foreground/60">{org.position}</span>
                  </span>
                )}

                <OrganizationMembersDrawer>
                  <Suspense fallback={<EmployeesSkeleton />}>
                    <OrganizationMembersContentMobile organizationId={organization.id} />
                  </Suspense>
                </OrganizationMembersDrawer>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const EmployeesSkeleton = () => {
  return (
    <div className="animate-pulse space-y-3">
      {[1, 2, 3].map((i) => (
        <div className="h-12 rounded-lg bg-muted" key={i} />
      ))}
    </div>
  )
}
