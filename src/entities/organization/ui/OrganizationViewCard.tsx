import { cn } from "@/shared/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/card"
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/components/field"

interface OrganizationData {
  name: string
  legalAddress: string
  actualAddress: string | null
  inn: string | null
  contractNumber: string
  timeSupportFrom: string
  timeSupportTo: string
  contractStart: Date
  contractEnd: Date
}

interface OrganizationViewProps {
  data: OrganizationData
  title?: string
  description?: string
  className?: string
}

export const OrganizationViewCard = ({
  data,
  title = "Данные организации",
  description = "Режим просмотра информации о контрагенте",
  className,
}: OrganizationViewProps) => {
  return (
    <div className={cn("flex h-full select-none items-start", className)}>
      <Card className="h-fit w-full min-w-2xs max-w-lg bg-transparent shadow-none ring-0">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <FieldGroup className="gap-2">
              <Field>
                <FieldLabel>Название</FieldLabel>
                <div
                  className={cn(
                    "field-height flex items-center rounded-md bg-muted px-2 font-medium text-foreground text-sm",
                  )}
                >
                  {data.name || "—"}
                </div>
              </Field>

              <Field>
                <FieldLabel>Юридический адрес</FieldLabel>
                <div
                  className={cn(
                    "field-height flex items-center rounded-md bg-muted px-2 font-medium text-foreground text-sm",
                  )}
                >
                  {data.legalAddress || "—"}
                </div>
              </Field>

              <Field>
                <FieldLabel>Фактический адрес</FieldLabel>
                <div
                  className={cn(
                    "field-height flex items-center rounded-md bg-muted px-2 font-medium text-foreground text-sm",
                  )}
                >
                  {data.actualAddress || "—"}
                </div>
              </Field>

              <Field>
                <FieldLabel>ИНН</FieldLabel>
                <div
                  className={cn(
                    "field-height flex items-center rounded-md bg-muted px-2 font-medium text-foreground text-sm",
                  )}
                >
                  {data.inn || "—"}
                </div>
              </Field>

              <Field>
                <FieldLabel>Номер договора</FieldLabel>
                <div
                  className={cn(
                    "field-height flex items-center rounded-md bg-muted px-2 font-medium text-foreground text-sm",
                  )}
                >
                  {data.contractNumber || "—"}
                </div>
              </Field>

              <Field>
                <FieldLabel>Время поддержки</FieldLabel>
                <div
                  className={cn(
                    "field-height flex items-center rounded-md bg-muted px-2 font-medium text-foreground text-sm",
                  )}
                >
                  {data.timeSupportFrom} — {data.timeSupportTo}
                </div>
              </Field>

              <div className="flex w-full gap-2">
                <Field className="flex-1">
                  <FieldLabel>Дата начала договора</FieldLabel>
                  <div
                    className={cn(
                      "field-height flex items-center rounded-md bg-muted px-2 font-medium text-foreground text-sm",
                    )}
                  >
                    {Intl.DateTimeFormat("ru").format(data.contractStart) || "—"}
                  </div>
                </Field>

                <Field className="flex-1">
                  <FieldLabel>Дата окончания договора</FieldLabel>
                  <div
                    className={cn(
                      "field-height flex items-center rounded-md bg-muted px-2 font-medium text-foreground text-sm",
                    )}
                  >
                    {Intl.DateTimeFormat("ru").format(data.contractEnd) || "—"}
                  </div>
                </Field>
              </div>
            </FieldGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
