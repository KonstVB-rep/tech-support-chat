import { USER_ROLE } from "@/shared/constants";
import { getSession } from "@/shared/lib/server-current-user";
import MobileNav from "@/widgets/mobile-nav/MobileNav";

export const MobileNavWrapper = async () => {

  const session = await getSession();
  const isAdmin = session?.user?.role?.toLowerCase() === USER_ROLE.ADMIN.toLowerCase();

  return <MobileNav isAdmin={isAdmin} />
};
