"use client";

import { ModeToggle } from "@/shared/ui/mode-toggle";
import AccountUser from "./AccountUser";
import { authClient } from "@/app/lib/auth-client";



const MainHeader = () => {
  const { data: session } = authClient.useSession();

  if (!session) return null;

  return (
    <header className="w-full flex justify-between items-center bg-muted p-2">
      <ModeToggle />
      {/* <UserButton size="icon" /> */}
      <AccountUser />
    </header>
  );
}

export default MainHeader;