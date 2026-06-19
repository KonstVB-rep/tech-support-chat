"use client";

import type React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { BetterUiProviders } from "./betterui-provider";
import QueryProvider from "./query-provider";
import dynamic from "next/dynamic";

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
          {children}
        </QueryProvider>
      </BetterUiProviders>
    </ThemeProvider>
  );
};

export default RootProvider;