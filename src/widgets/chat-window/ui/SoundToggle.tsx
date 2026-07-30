// src/widgets/chat-window/ui/SoundToggle.tsx
"use client"

import { Volume2, VolumeX } from "lucide-react"
import { useNotificationSound } from "@/shared/lib/useNotificationSound"
import { Button } from "@/shared/ui/components/button"

const SoundToggle = () => {
  const { enabled, toggle } = useNotificationSound()

  return (
    <Button
      className="flex h-10 items-center justify-start gap-2 rounded-md bg-primary/15 text-primary hover:bg-primary/30 focus-visible:bg-primary/30"
      onClick={toggle}
      title={enabled ? "Отключить звук уведомлений" : "Включить звук уведомлений"}
    >
      {enabled ? (
        <Volume2 className="size-5" />
      ) : (
        <VolumeX className="size-5 text-muted-foreground" />
      )}
      Звук
    </Button>
  )
}

export default SoundToggle
