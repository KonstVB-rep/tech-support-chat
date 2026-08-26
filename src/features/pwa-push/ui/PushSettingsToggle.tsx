"use client"

import { useTransition } from "react"
import { Loader2, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import {
  type PushSettingsSource,
  updatePushSettingsAction,
} from "@/entities/notification/api/updatePushSettingsAction"
import { Switch } from "@/shared/ui/components/switch"

interface Props {
  profileId: string
  isSupportEngineer: boolean
  pushEnabled: boolean
  isViewedByAdmin: boolean
  source: PushSettingsSource
  organizationId?: string
}

export const PushSettingsToggle = ({
  profileId,
  isSupportEngineer,
  pushEnabled,
  isViewedByAdmin,
  source,
  organizationId,
}: Props) => {
  const [isPending, startTransition] = useTransition()

  const isSupport = isSupportEngineer
  const isEditable = !isSupport || isViewedByAdmin

  const handleToggle = () => {
    startTransition(async () => {
      const res = await updatePushSettingsAction({
        targetProfileId: profileId,
        pushEnabled: !pushEnabled,
        source,
        organizationId,
      })

      if (res.success) {
        toast.success("Настройки уведомлений обновлены")
      } else {
        toast.error(res.error || "Ошибка")
      }
    })
  }

  return (
    <div className="space-y-2">
      {!isEditable && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 font-medium text-[11px] text-amber-700">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Инженерам запрещено отключать уведомления. Для изменения обратитесь к администратору.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-muted/30">
        <div>
          <p className="font-bold text-xs">Push-уведомления</p>
          <p className="text-[10px] text-muted-foreground">Оповещения на экране блокировки</p>
        </div>

        <Switch
          checked={pushEnabled}
          className="data-[size=sm]:h-8 data-[size=sm]:w-16"
          classNameSwitch="dark:data-checked:bg-[linear-gradient(137deg,#156f51,#489d7d,#005232)] data-checked:bg-[linear-gradient(137deg,#156f51,#489d7d,#005232)] group-data-[size=sm]/switch:size-6 group-data-[size=sm]/switch:data-checked:translate-x-[calc(150%)] grid place-items-center"
          disabled={!isEditable}
          iconSwitch={isPending ? <Loader2 className="h-4 w-4 animate-spin text-blue-600" /> : ""}
          onCheckedChange={handleToggle}
          size={"sm"}
        />
      </div>
    </div>
  )
}
