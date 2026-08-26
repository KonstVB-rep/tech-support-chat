import type React from "react"
import { cn } from "@/shared/lib/utils"

const WrapperScreen = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center border-border border-x bg-transparent shadow-xl md:max-h-dvh",
        className,
      )}
    >
      {children}
    </div>
  )
}

export default WrapperScreen
