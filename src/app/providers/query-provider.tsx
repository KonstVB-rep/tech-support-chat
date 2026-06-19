'use client'

import type { PropsWithChildren } from "react"
import {
  isServer,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { TOAST } from "@/shared/ui/Toast"


function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.errorMessage) {
          TOAST.ERROR(query.meta.errorMessage as string)
          return
        }

        const message = error instanceof Error ? error.message : "Произошла ошибка"
        TOAST.ERROR(message === "Failed to fetch" ? "Ошибка сети" : message)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (typeof window === "undefined") return
        TOAST.ERROR(error.message)
      },
    }),
  })
}

let browserQueryClient: QueryClient | undefined

export const getQueryClient = () => {
  if (isServer) {
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
