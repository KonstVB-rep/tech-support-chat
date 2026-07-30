import type { ReactNode } from "react"
import type { EmployeeWithProfile } from "@/entities/employee"
import { DeleteEmployeeDialog, UpdateEmployee } from "@/features/manage-employee"
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle"
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent"

const EmployeeActionsMenu = ({
  data,
  trigger,
  side,
}: {
  data: EmployeeWithProfile
  trigger: ReactNode
  side: "left" | "right" | "bottom" | "top"
}) => {
  return (
    <DrawerComponent side={side} trigger={trigger}>
      <div className="no-scrollbar flex h-full flex-col gap-3 overflow-hidden overflow-y-auto p-4">
        <UpdateEmployee employee={data} />
        <PushSettingsToggle
          isSupportEngineer={false}
          isViewedByAdmin={false}
          organizationId={data.organizationId}
          profileId={data.profileId}
          pushEnabled={data.profile.pushEnabled}
          source="organization"
        />
        <DeleteEmployeeDialog
          employeeName={data.profile.name}
          ids={data.id}
          organizationId={data.organizationId}
        />
      </div>
    </DrawerComponent>
  )
}

export default EmployeeActionsMenu
