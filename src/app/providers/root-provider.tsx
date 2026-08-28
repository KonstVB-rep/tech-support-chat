"use client"

import type React from "react"
import { Suspense } from "react"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/app/providers/theme-provider"
import { UserUpdatesListener } from "@/shared/lib/UserUpdatesListener"
import { useRegisterSW } from "@/shared/lib/useRegisterSW"
import { PushPermissionGate } from "@/widgets/push-permission/PushPermissionGate"
import { BetterUiProviders } from "./betterui-provider"
import QueryProvider from "./query-provider"
import { SocketInitializer } from "./socket-Initializer"

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  useRegisterSW()
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
      storageKey="theme"
    >
      <BetterUiProviders>
        <QueryProvider>
          <Toaster closeButton position="top-center" richColors />
          <SocketInitializer />
          <Suspense>
            <PushPermissionGate />
          </Suspense>
          <UserUpdatesListener />
          {children}
        </QueryProvider>
      </BetterUiProviders>
    </ThemeProvider>
  )
}

export default RootProvider
