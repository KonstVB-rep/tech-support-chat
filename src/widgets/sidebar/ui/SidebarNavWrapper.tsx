import { getSession } from "@/shared/lib/server-current-user";
import { USER_ROLE } from "@/shared/constants";
import { SidebarNav } from "./SidebarNav";

export const SidebarNavWrapper = async () => {

  const session = await getSession();
  const isAdmin = session?.user?.role?.toLowerCase() === USER_ROLE.ADMIN.toLowerCase();

  return <SidebarNav isAdmin={isAdmin} />;
}
