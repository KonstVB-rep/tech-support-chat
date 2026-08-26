"use client"

import type React from "react"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/app/providers/theme-provider"
import { UserUpdatesListener } from "@/shared/lib/UserUpdatesListener"
import { PushPermissionGate } from "@/widgets/push-permission/PushPermissionGate"
import { BetterUiProviders } from "./betterui-provider"
import QueryProvider from "./query-provider"
import { SocketInitializer } from "./socket-Initializer"

const _ReactQueryDevtools = dynamic(
  () => import("@tanstack/react-query-devtools").then((mod) => mod.ReactQueryDevtools),
  {
    ssr: false,
  },
)

const RootProvider = ({ children }: { children: React.ReactNode }) => {
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
          {/* {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )} */}
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
