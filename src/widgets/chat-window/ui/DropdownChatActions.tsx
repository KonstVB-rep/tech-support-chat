import type React from "react"
import { EllipsisVertical } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/components/dropdown-menu"

const DropdownChatActions = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn("h-8 w-8 p-0", className)} variant="ghost">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit p-2">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropdownChatActions
