"use client";

import type React from "react";

import { Toaster } from "sonner";
import { BetterUiProviders } from "./betterui-provider";
import QueryProvider from "./query-provider";
import dynamic from "next/dynamic";
import { SocketInitializer } from "./socket-Initializer";
import { PushPermissionGate } from "@/widgets/push-permission/PushPermissionGate";
import { Suspense } from "react";
import { UserUpdatesListener } from "@/shared/lib/UserUpdatesListener";
import { ThemeProvider } from "@/app/providers/theme-provider";

const ReactQueryDevtools = dynamic(
  () =>
    import("@tanstack/react-query-devtools").then(
      (mod) => mod.ReactQueryDevtools,
    ),
  {
    ssr: false,
  },
);

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
          <Toaster position="top-center" richColors closeButton />
          <SocketInitializer />
          <Suspense>
            <PushPermissionGate />
          </Suspense>
          <UserUpdatesListener />
          {children}
        </QueryProvider>
      </BetterUiProviders>
    </ThemeProvider>
  );
};

export default RootProvider;
