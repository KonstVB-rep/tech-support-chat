"use client";

import { EmployeeWithProfile } from "@/entities/employee";
import { DataTable } from "@/shared/ui/custom/DataTable";
import FixedWrapper from "@/shared/ui/custom/FixedWrapper";
import { OrgRole } from "@prisma/client";
import { columns } from "./columns";
import { DeleteEmployeeDialog } from "@/features/manage-employee";
import { useMediaQuery } from "@/shared/lib/hooks/useMediaQuery";
import Link from "next/link";
import { Mail, Phone, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import Image from "next/image";
import EmployeeActionsMenu from "@/widgets/employee/ui/EmployeeActionsMenu";
import { Button } from "@/shared/ui/button";

const EmployessTable = ({
  data,
  className,
}: {
  data: EmployeeWithProfile[];
  className?: string;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      {isDesktop ? (
        <div className="w-full h-full border border-border/40 rounded-xl bg-background/50 overflow-y-auto">
          <DataTable
            columns={columns}
            data={data}
            className={className}
            getRowClassName={(row) =>
              row.role === OrgRole.RESPONSIBLE
                ? "dark:bg-[#575555] bg-[#dcdcdc]"
                : ""
            }
            actionsButtonsFixed={(
              dataIds: string[],
              resetSelection: () => void,
            ) => (
              <FixedWrapper>
                <DeleteEmployeeDialog
                  ids={dataIds}
                  onAfterDelete={resetSelection}
                  organizationId={data[0]?.organizationId}
                />
              </FixedWrapper>
            )}
          />
        </div>
      ) : (
        <div className="grid gap-2 p-3 min-w-72">
          {data.map((p) => {
            return <ParticipantCard key={p.id} data={p} />;
          })}
        </div>
      )}
    </>
  );
};

export default EmployessTable;

const ParticipantCard = ({ data }: { data: EmployeeWithProfile }) => {
  const { profile, position } = data;

  const name = profile.name;
  const email = profile.email;
  const phone = profile.phone;
  const role = position ?? profile.user.role;
  const imageUrl = profile.imageUrl;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-0.5 gap-2">
      <CardHeader className="flex flex-row items-start gap-2 pb-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-lg overflow-hidden ring-2 ring-background">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="truncate font-semibold text-lg leading-none text-foreground">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate capitalize">{role}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-3 p-2">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 shrink-0 text-muted-foreground/70" />
          <span className="truncate">{email}</span>
        </div>
        {phone && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground/70" />
            <span className="font-medium text-foreground">{phone}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-2">
        <EmployeeActionsMenu
          trigger={
            <Button className="w-fit ml-auto flex items-center px-4 py-2 border gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 rounded-xl">
              <span>Подробнее</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          }
          side="bottom"
          data={data}
        />
      </CardFooter>
    </Card>
  );
};
