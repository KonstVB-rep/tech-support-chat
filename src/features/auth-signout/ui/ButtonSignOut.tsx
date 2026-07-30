"use client"

import { LogOut } from "lucide-react"
import { Button } from "@/shared/ui/components/button"
import { useSignOut } from "../model/useSignOut"

const ButtonSignOut = ({
  className,
  size,
  withIcon = false,
  withText = false,
  variant = "default",
}: {
  withIcon?: boolean
  withText?: boolean
  className?: string
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
    | undefined
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
}) => {
  const { handleSignOut } = useSignOut()
  return (
    <form onSubmit={handleSignOut}>
      <Button className={className} size={size} type="submit" variant={variant}>
        {withIcon && <LogOut />} {withText && "Выйти"}
      </Button>
    </form>
  )
}

export default ButtonSignOut
