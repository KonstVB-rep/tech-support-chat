import { EmployeeWithProfile } from "@/entities/employee";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import EmployeeActionsMenu from "@/widgets/employee/ui/EmployeeActionsMenu";
import { Mail, Phone, Briefcase, ArrowRight } from "lucide-react";

type EmployeeCardProps = {
  employee: EmployeeWithProfile;
};

const roleLabels: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  RESPONSIBLE: { label: "Ответственный", variant: "default" },
  MEMBER: { label: "Сотрудник", variant: "secondary" },
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const roleInfo = roleLabels[employee.role] ?? {
    label: employee.role,
    variant: "outline" as const,
  };

  return (
    <div className="group relative flex flex-col min-w-72 gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30 min-w-0">
      {/* Шапка: Аватар + Имя + Роль */}
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border-2 border-border/50 shadow-sm">
          {employee.profile.imageUrl ? (
            <AvatarImage
              src={employee.profile.imageUrl}
              alt={employee.profile.name}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-lg font-semibold text-primary-foreground">
            {getInitials(employee.profile.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground">
            {employee.profile.name}
          </h3>

          {employee.position && (
            <div className="mt-1 flex flex-1 items-start leading-normal gap-1.5 text-sm text-muted-foreground">
              <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="wrap-break-word">{employee.position}</span>
            </div>
          )}
        </div>

        <Badge
          variant={roleInfo.variant}
          className="absolute top-2 right-2 flex-shrink-0 text-[10px] uppercase tracking-wide"
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
            href={`mailto:${employee.profile.email}`}
            className="group/link flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4 flex-shrink-0 opacity-60 group-hover/link:opacity-100" />
            <span className="truncate">{employee.profile.email}</span>
          </a>
        )}

        {employee.profile.phone && (
          <a
            href={`tel:${employee.profile.phone}`}
            className="group/link flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4 flex-shrink-0 opacity-60 group-hover/link:opacity-100" />
            <span className="truncate">{employee.profile.phone}</span>
          </a>
        )}
      </div>
      <EmployeeActionsMenu
        trigger={
          <Button className="w-fit ml-auto flex items-center px-4 py-2 border gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 rounded-xl">
            <span>Подробнее</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        }
        side="bottom"
        data={employee}
      />
    </div>
  );
};
