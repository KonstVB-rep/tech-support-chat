"use client";

import { useTransition } from "react";

import { PushSettingsSource, updatePushSettingsAction } from "@/entities/notification/api/updatePushSettingsAction";
import { toast } from "sonner";
import { ShieldAlert, Loader2 } from "lucide-react";
import { Switch } from "@/shared/ui/switch";

interface Props {
  profileId: string;
  isSupportEngineer: boolean;
  pushEnabled: boolean;
  isViewedByAdmin: boolean;
  source: PushSettingsSource;
  organizationId?: string;
}

export const PushSettingsToggle = ({
  profileId,
  isSupportEngineer,
  pushEnabled,
  isViewedByAdmin,
  source,
  organizationId,
}: Props) => {
  const [isPending, startTransition] = useTransition();

  const isSupport = isSupportEngineer;
  const isEditable = !isSupport || isViewedByAdmin;

  const handleToggle = () => {
    startTransition(async () => {
      const res = await updatePushSettingsAction({
        targetProfileId: profileId,
        pushEnabled: !pushEnabled,
        source,
        organizationId,
      });

      if (res.success) {
        toast.success("Настройки уведомлений обновлены");
      } else {
        toast.error(res.error || "Ошибка");
      }
    });
  };

  return (
    <div className="space-y-2">
      {!isEditable && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-[11px] text-amber-700 font-medium">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Инженерам запрещено отключать уведомления. Для изменения обратитесь
            к администратору.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/30 transition-colors">
        <div>
          <label className="text-xs font-bold">Push-уведомления</label>
          <p className="text-[10px] text-muted-foreground">
            Оповещения на экране блокировки
          </p>
        </div>
   
          <Switch
            className="data-[size=sm]:h-8 data-[size=sm]:w-16"
            classNameSwitch="dark:data-checked:bg-[linear-gradient(137deg,#156f51,#489d7d,#005232)] data-checked:bg-[linear-gradient(137deg,#156f51,#489d7d,#005232)] group-data-[size=sm]/switch:size-6 group-data-[size=sm]/switch:data-checked:translate-x-[calc(150%)] grid place-items-center"
            iconSwitch={isPending ? <Loader2 className="h-4 w-4 animate-spin text-blue-600" /> : ""}
            size={"sm"}
            checked={pushEnabled}
            disabled={!isEditable}
            onCheckedChange={handleToggle}
          />
      </div>
    </div>
  );
};