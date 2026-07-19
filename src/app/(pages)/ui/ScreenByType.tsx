import { SIDEBAR_TYPES, SidebarTypes } from "@/widgets/types";
import { SelectedScreen } from "./SelectedScreen";

type ScreenByTypeProps = {
  screenType: SidebarTypes;
};

const ScreenByType = ({ screenType }: ScreenByTypeProps) => {
  return (
    <>{screenType === SIDEBAR_TYPES.CHATS && <SelectedScreen.ChatWindow />}</>
  );
};

export default ScreenByType;
