'use client'
import type { ReactNode } from "react"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { RU_LOCALE } from "@/shared/lib/18n/ru"
import { authClient } from "../lib/auth-client"


export function BetterUiProviders({ children }: { children: ReactNode }) {
  const router = useRouter()
  return (
    <AuthUIProvider
      authClient={authClient}
      Link={Link}
      localization={RU_LOCALE}
      navigate={router.push}
      onSessionChange={() => {
        router.refresh()
      }}
      replace={router.replace}
    >
      {children}
    </AuthUIProvider>
  )
}
