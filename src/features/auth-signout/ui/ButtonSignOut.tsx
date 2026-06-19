"use client";

import { Button } from "@/shared/ui/button";
import { useSignOut } from "../model/useSignOut";



const ButtonSignOut = ({
  className,
  size,
}: {
  className?: string;
  size?:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
}) => {
  const { handleSignOut } = useSignOut();
  return (
    <form onSubmit={handleSignOut}>
      <Button className={className} size={size} type="submit">
        Выйти
      </Button>
    </form>
  );
};

export default ButtonSignOut;
