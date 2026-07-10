'use client'

import type { PropsWithChildren } from "react"
import {
  environmentManager, 
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { TOAST } from "@/shared/ui/Toast"

function makeQueryClient() {

  const isServerSide = environmentManager.isServer();

  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false, 
        staleTime: 1000 * 5, 
      },
    },
    
    queryCache: new QueryCache({
      onError: (error: any, query) => {
        const isAuthError = 
          error?.status === 401 || 
          error?.status === 403 || 
          error?.message?.includes("401") || 
          error?.message?.includes("Unauthorized") ||
          error?.message?.includes("Не авторизован");

        if (isAuthError) {
          // 🚀 Используем новый безопасный флаг
          if (!isServerSide) {
            const currentPath = window.location.pathname;
            window.location.href = `/auth/sign-in?redirect=${encodeURIComponent(currentPath)}`;
          }
          return; 
        }

        if (query.meta?.errorMessage) {
          TOAST.ERROR(query.meta.errorMessage as string)
          return
        }

        const message = error instanceof Error ? error.message : "Произошла ошибка"
        TOAST.ERROR(message === "Failed to fetch" ? "Ошибка сети (Проверьте подключение)" : message)
      },
    }),

    mutationCache: new MutationCache({
      onError: (error: any) => {
        // 🚀 Защита SSR контура через новое API
        if (isServerSide) return;

        const isAuthError = error?.status === 401 || error?.message?.includes("401");
        if (isAuthError) {
          window.location.href = "/auth/sign-in";
          return;
        }

        TOAST.ERROR(error.message || "Ошибка при выполнении операции")
      },
    }),
  })
}

let browserQueryClient: QueryClient | undefined

export const getQueryClient = () => {
  if (environmentManager.isServer()) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

const QueryProvider = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider;
