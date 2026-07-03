

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@/shared/ui/field";

// Описываем строгий интерфейс принимаемых данных организации для отображения
interface OrganizationData {
  name: string;
  legalAddress: string;
  actualAddress: string | null;
  inn: string | null;
  contractNumber: string;
  supportHours: string;
  contractStart: Date; 
  contractEnd: Date;
}

interface OrganizationViewProps {
  data: OrganizationData;
  title?: string;
  description?: string;
}

export const OrganizationViewCard = ({
  data,
  title = "Данные организации",
  description = "Режим просмотра информации о контрагенте",
}: OrganizationViewProps) => {
  return (
    <div className="flex items-start justify-center w-full h-full select-none">
      <Card className="w-full max-w-lg min-w-2xs h-fit bg-transparent shadow-none ring-0">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <FieldGroup className="gap-2">
              
              <Field>
                <FieldLabel>Название</FieldLabel>
                <div className={cn("field-height flex items-center text-sm font-medium text-foreground px-2 bg-muted rounded-md")}>
                  {data.name || "—"}
                </div>
              </Field>

              <Field>
                <FieldLabel>Юридический адрес</FieldLabel>
                <div className={cn("field-height flex items-center text-sm font-medium text-foreground px-2 bg-muted rounded-md")}>
                  {data.legalAddress || "—"}
                </div>
              </Field>

              <Field>
                <FieldLabel>Фактический адрес</FieldLabel>
                <div className={cn("field-height flex items-center text-sm font-medium text-foreground px-2 bg-muted rounded-md")}>
                  {data.actualAddress || "—"}
                </div>
              </Field>

              <Field>
                <FieldLabel>ИНН</FieldLabel>
                <div className={cn("field-height flex items-center text-sm font-medium text-foreground px-2 bg-muted rounded-md")}>
                  {data.inn || "—"}
                </div>
              </Field>

              <Field>
                <FieldLabel>Номер договора</FieldLabel>
                <div className={cn("field-height flex items-center text-sm font-medium text-foreground px-2 bg-muted rounded-md")}>
                  {data.contractNumber || "—"}
                </div>
              </Field>

              <Field>
                <FieldLabel>Время поддержки</FieldLabel>
                <div className={cn("field-height flex items-center text-sm font-medium text-foreground px-2 bg-muted rounded-md")}>
                  {data.supportHours || "—"}
                </div>
              </Field>

              <div className="flex gap-2 w-full">
                <Field className="flex-1">
                  <FieldLabel>Дата начала договора</FieldLabel>
                  <div className={cn("field-height flex items-center text-sm font-medium text-foreground px-2 bg-muted rounded-md")}>
                    {Intl.DateTimeFormat("ru").format(data.contractStart)  || "—"}
                  </div>
                </Field>

                <Field className="flex-1">
                  <FieldLabel>Дата окончания договора</FieldLabel>
                  <div className={cn("field-height flex items-center text-sm font-medium text-foreground px-2 bg-muted rounded-md")}>
                    {Intl.DateTimeFormat("ru").format(data.contractEnd)  || "—"}
                  </div>
                </Field>
              </div>

            </FieldGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationViewCard;
