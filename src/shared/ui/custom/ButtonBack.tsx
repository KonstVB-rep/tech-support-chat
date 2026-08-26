"use client"

import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/ui/components/button"

const ButtonBack = () => {
  const router = useRouter()
  return (
    <Button
      className="shrink-0"
      onClick={() => router.back()}
      size="icon"
      type="button"
      variant="ghost"
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  )
}

export default ButtonBack
