// src/shared/lib/useNotificationSound.ts
"use client"

import { useEffect, useRef, useState } from "react"

const STORAGE_KEY = "notification-sound-enabled"

export function useNotificationSound() {
  const [enabled, setEnabled] = useState(true)
  const enabledRef = useRef(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      const val = stored === "true"
      setEnabled(val)
      enabledRef.current = val
    }
  }, [])

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    audioRef.current = new Audio("/sounds/telegram-notification.mp3")
    audioRef.current.preload = "auto"
  }, [])

  const play = () => {
    if (!enabledRef.current || !audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev
      enabledRef.current = next
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  return { enabled, play, toggle }
}
