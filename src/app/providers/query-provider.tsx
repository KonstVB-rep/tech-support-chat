"use client"

import type { PropsWithChildren } from "react"
import {
  environmentManager,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { TOAST } from "@/shared/ui/components/Toast"

function makeQueryClient() {
  const isServerSide = environmentManager.isServer()

  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 1000 * 5,
      },
    },

    queryCache: new QueryCache({
      onError: (error: unknown, query) => {
        const err = error as { status?: number; message?: string }

        const isAuthError =
          err?.status === 401 ||
          err?.status === 403 ||
          err?.message?.includes("401") ||
          err?.message?.includes("Unauthorized") ||
          err?.message?.includes("Не авторизован")

        if (isAuthError) {
          if (!isServerSide) {
            const currentPath = window.location.pathname
            window.location.href = `/auth/sign-in?redirect=${encodeURIComponent(currentPath)}`
          }
          return
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
      onError: (error: unknown) => {
        if (isServerSide) return

        const err = error as { status?: number; message?: string }

        const isAuthError = err.status === 401 || err.message?.includes("401")

        if (isAuthError) {
          window.location.href = "/auth/sign-in"
          return
        }

        const textError = err.message || "Ошибка при выполнении операции"
        TOAST.ERROR(textError)
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

export default QueryProvider
