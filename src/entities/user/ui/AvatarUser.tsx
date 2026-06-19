import { authClient } from "@/app/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";


const AvatarUser = () => {
  const { data: session } = authClient.useSession();

  if (!session) return null;
  return (
    <Avatar>
      <AvatarImage
        alt="@shadcn"
        className="grayscale"
        src={session.user.image || "https://github.com/shadcn.png"}
      />
      <AvatarFallback>{session.user.name.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarUser;
