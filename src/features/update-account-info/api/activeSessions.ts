// src/entities/user/api/activeSessions.ts
"use server"

import { headers } from "next/headers"
import { auth } from "@/app/lib/auth"

export const getActiveSessions = async () => {
  const requestHeaders = await headers()
  return auth.api.listSessions({ headers: requestHeaders })
}

export const revokeSessionAction = async (sessionId: string) => {
  const requestHeaders = await headers()
  await auth.api.revokeSession({
    body: { token: sessionId },
    headers: requestHeaders,
  })
}
