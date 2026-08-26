"use client"
import { Avatar, AvatarImage } from "@/shared/ui/components/avatar"

const AvatarUser = () => {
  return (
    <Avatar className="flex h-full w-full items-center justify-center">
      <AvatarImage alt="@shadcn" className="grayscale" src={"https://github.com/shadcn.png"} />
      {/* <AvatarFallback>{session.user.name.substring(0, 2)}</AvatarFallback> */}
    </Avatar>
  )
}

export default AvatarUser
