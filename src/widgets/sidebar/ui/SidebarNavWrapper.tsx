import { getSession } from "@/shared/lib/server-current-user";
import { USER_ROLE } from "@/shared/constants";
import { SidebarNav } from "./SidebarNav"; // Твой клиентский сайдбар

export async function SidebarNavWrapper() {
  // 🎯 Динамический вызов кук теперь изолирован внутри этого компонента!
  const session = await getSession();
  const isAdmin = session?.user?.role?.toLowerCase() === USER_ROLE.ADMIN.toLowerCase();

  return <SidebarNav isAdmin={isAdmin} />;
}
