// src/shared/lib/useUserUpdates.ts
"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { getSocket } from "../socket"

export const useUserUpdates = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const socket = getSocket()

    const handleUserUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ["session"] })
      queryClient.invalidateQueries({ queryKey: ["support-engineers"] })
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      queryClient.invalidateQueries({ queryKey: ["messages"] })
    }

    socket.on("user:updated", handleUserUpdated)
    return () => {
      socket.off("user:updated", handleUserUpdated)
    }
  }, [queryClient])
}
