"use client"
import { useUserUpdates } from "@/shared/lib/hooks/useUserUpdates"

export const UserUpdatesListener = () => {
  useUserUpdates()
  return null
}
