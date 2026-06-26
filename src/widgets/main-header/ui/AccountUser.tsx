import { authClient } from "@/app/lib/auth-client";
import { AvatarUser } from "@/entities/user";
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import Link from "next/link";



const AccountUser = () => {
  const { data: session } = authClient.useSession();

  if (!session) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size="icon" variant="outline">
          <AvatarUser />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuLabel>
          <p>{session.user.name}</p>
          <p>{session.user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuItem>
          <Link href="/account">Аккаунт</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href="/account/settings">Настройки</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ButtonSignOut className="bg-inherit p-0 h-auto text-white" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountUser;
