import { EmployeeWithProfile } from "@/entities/employee";
import {
  UpdateEmployee,
  DeleteEmployeeDialog,
} from "@/features/manage-employee";
import { PushSettingsToggle } from "@/features/pwa-push/ui/PushSettingsToggle";
import { DrawerComponent } from "@/shared/ui/custom/DrawerComponent";
import { ReactNode } from "react";

const EmployeeActionsMenu = ({
  data,
  trigger,
  side,
}: {
  data: EmployeeWithProfile;
  trigger: ReactNode;
  side: "left" | "right" | "bottom" | "top";
}) => {
  return (
    <DrawerComponent trigger={trigger} side={side}>
      <div className="no-scrollbar overflow-y-auto p-4 flex flex-col gap-3 h-full overflow-hidden">
        <UpdateEmployee employee={data} />
        <PushSettingsToggle
          profileId={data.profileId}
          isSupportEngineer={false}
          pushEnabled={data.profile.pushEnabled}
          isViewedByAdmin={false}
          source="organization"
          organizationId={data.organizationId}
        />
        <DeleteEmployeeDialog
          ids={data.id}
          employeeName={data.profile.name}
          organizationId={data.organizationId}
        />
      </div>
    </DrawerComponent>
  );
};

export default EmployeeActionsMenu;
