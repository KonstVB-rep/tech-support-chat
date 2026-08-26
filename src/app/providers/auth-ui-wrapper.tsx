// src/app/providers/auth-ui-wrapper.tsx
"use client"

import { type ReactNode, Suspense } from "react"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RU_LOCALE } from "@/shared/lib/18n/ru"
import { authClient } from "../lib/auth-client"

export const AuthUIWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  return (
    <Suspense fallback={null}>
      <AuthUIProvider
        authClient={authClient}
        Link={Link}
        localization={RU_LOCALE}
        navigate={router.push}
        onSessionChange={() => router.refresh()}
        replace={router.replace}
      >
        {children}
      </AuthUIProvider>
    </Suspense>
  )
}
