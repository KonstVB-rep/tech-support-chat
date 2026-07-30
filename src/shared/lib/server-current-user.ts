// src/shared/lib/server-auth.ts
"use server"
import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { auth } from "@/app/lib/auth"

export const getSession = cache(async () => {
  await connection()

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
})

export const getCurrentUser = cache(async () => {
  const session = await getSession()
  return session?.user ?? null
})

export const requireAuth = async (redirectUrl = "/auth/sign-in") => {
  const user = await getCurrentUser()
  if (!user) {
    redirect(redirectUrl)
  }
  return user
}

export const requireRole = async (allowedRoles: string[], redirectUrl = "/") => {
  const user = await requireAuth(redirectUrl)
  if (!allowedRoles.includes(user.role)) {
    redirect(redirectUrl)
  }
  return user
}
