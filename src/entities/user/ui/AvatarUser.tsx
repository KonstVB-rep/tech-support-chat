"use client";
import { authClient } from "@/app/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

const AvatarUser = () => {
  return (
    <Avatar className="w-full h-full flex items-center justify-center">
      <AvatarImage
        alt="@shadcn"
        className="grayscale"
        src={"https://github.com/shadcn.png"}
      />
      {/* <AvatarFallback>{session.user.name.substring(0, 2)}</AvatarFallback> */}
    </Avatar>
  );
};

export default AvatarUser;
