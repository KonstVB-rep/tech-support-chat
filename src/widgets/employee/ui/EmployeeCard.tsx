import { ArrowRight, Briefcase, Mail, Phone } from "lucide-react"
import type { EmployeeWithProfile } from "@/entities/employee"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/components/avatar"
import { Badge } from "@/shared/ui/components/badge"
import { Button } from "@/shared/ui/components/button"
import EmployeeActionsMenu from "@/widgets/employee/ui/EmployeeActionsMenu"

type EmployeeCardProps = {
  employee: EmployeeWithProfile
}

const roleLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> =
  {
    RESPONSIBLE: { label: "Ответственный", variant: "default" },
    MEMBER: { label: "Сотрудник", variant: "secondary" },
  }

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const roleInfo = roleLabels[employee.role] ?? {
    label: employee.role,
    variant: "outline" as const,
  }

  return (
    <div className="group relative flex min-w-0 min-w-72 flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border-2 border-border/50 shadow-sm">
          {employee.profile.imageUrl ? (
            <AvatarImage
              alt={employee.profile.name}
              className="object-cover"
              src={employee.profile.imageUrl}
            />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 font-semibold text-lg text-primary-foreground">
            {getInitials(employee.profile.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-base text-foreground">{employee.profile.name}</h3>

          {employee.position && (
            <div className="mt-1 flex flex-1 items-start gap-1.5 text-muted-foreground text-sm leading-normal">
              <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="wrap-break-word">{employee.position}</span>
            </div>
          )}
        </div>

        <Badge
          className="absolute top-2 right-2 flex-shrink-0 text-[10px] uppercase tracking-wide"
          variant={roleInfo.variant}
        >
          {roleInfo.label}
        </Badge>
      </div>

      {/* Разделитель */}
      <div className="h-px w-full bg-border/60" />

      {/* Контакты */}
      <div className="flex flex-col gap-2.5">
        {employee.profile.email && (
          <a
            className="group/link flex items-center gap-2.5 text-muted-foreground text-sm transition-colors hover:text-primary"
            href={`mailto:${employee.profile.email}`}
          >
            <Mail className="h-4 w-4 flex-shrink-0 opacity-60 group-hover/link:opacity-100" />
            <span className="truncate">{employee.profile.email}</span>
          </a>
        )}

        {employee.profile.phone && (
          <a
            className="group/link flex items-center gap-2.5 text-muted-foreground text-sm transition-colors hover:text-primary"
            href={`tel:${employee.profile.phone}`}
          >
            <Phone className="h-4 w-4 flex-shrink-0 opacity-60 group-hover/link:opacity-100" />
            <span className="truncate">{employee.profile.phone}</span>
          </a>
        )}
      </div>
      <EmployeeActionsMenu
        data={employee}
        side="bottom"
        trigger={
          <Button className="ml-auto flex w-fit items-center gap-2 rounded-xl border px-4 py-2 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <span>Подробнее</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        }
      />
    </div>
  )
}
