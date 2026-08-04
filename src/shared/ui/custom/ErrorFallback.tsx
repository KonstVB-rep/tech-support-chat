// shared/ui/custom/ErrorFallback.tsx
"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import ButtonSignOut from "@/features/auth-signout/ui/ButtonSignOut"
import { Button } from "@/shared/ui/components/button"

interface ErrorFallbackProps {
  error: Error & { digest?: string }
  onRetry: () => void
  contextName?: string // Для логов
}

export const ErrorFallback = ({ error, onRetry, contextName = "App" }: ErrorFallbackProps) => {
  console.error(`${contextName} Error Log:`, error)

  return (
    <div className="fade-in flex min-h-[70dvh] w-full flex-1 animate-in select-none flex-col items-center justify-center p-6 text-center duration-300">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-border/60 bg-card/30 p-8 shadow-sm backdrop-blur-xs">
        <div className="mb-4 shrink-0 rounded-full bg-destructive/10 p-3 text-destructive">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h2 className="mb-2 font-bold text-foreground text-xl">Что-то пошло не так</h2>
        <p className="mb-6 text-muted-foreground text-sm">
          Произошла непредвиденная ошибка.
          {error.digest && (
            <span className="mt-2 block rounded-sm bg-muted px-2 py-1 font-mono text-[11px] text-foreground/70">
              ID: {error.digest}
            </span>
          )}
        </p>

        <div className="flex w-full flex-col items-center gap-3">
          <Button
            className="flex h-10 w-full items-center justify-center gap-2 font-semibold"
            onClick={onRetry}
          >
            <RefreshCw className="h-4 w-4" />
            Повторить запрос
          </Button>

          <div className="w-full">
            <p className="mb-2 text-muted-foreground text-xs">Если ничего не помогает:</p>
            <ButtonSignOut
              className="mx-auto flex h-auto w-full select-none items-center justify-center gap-1 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50 hover:text-foreground"
              withIcon={true}
              withText={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
