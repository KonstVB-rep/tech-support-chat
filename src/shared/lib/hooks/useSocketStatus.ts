// src/shared/lib/socket-status.ts (или внутри вашего Zustand стора)

"use client"
import { useEffect, useState } from "react"
import { getSocket } from "../socket"

export function useSocketStatus() {
  const [status, setStatus] = useState<"connected" | "connecting" | "disconnected">("connecting")

  useEffect(() => {
    const socket = getSocket()

    const onConnect = () => setStatus("connected")
    const onDisconnect = () => setStatus("disconnected")
    const onConnectError = () => setStatus("connecting") // Пытается переподключиться

    // Проверяем текущее состояние при монтировании
    if (socket.connected) setStatus("connected")

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("connect_error", onConnectError)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("connect_error", onConnectError)
    }
  }, [])

  return status
}
