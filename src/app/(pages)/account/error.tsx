"use client"

import { useEffect } from "react"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import { Button } from "@/shared/ui/components/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Здесь можно отправлять логи в сторонние сервисы (например, Sentry)
    console.error("Dashboard Error Log:", error)
  }, [error])

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
              ID ошибки: {error.digest}
            </span>
          )}
        </p>

        <div className="flex w-full flex-col items-center gap-3">
          <Button
            className="flex h-10 w-full items-center justify-center gap-2 font-semibold"
            onClick={() => reset()}
          >
            <RefreshCw className="h-4 w-4" />
            Повторить запрос
          </Button>

          <Button
            className="flex h-10 w-full items-center justify-center gap-2 border-border/80"
            onClick={() => {
              const currentPath = window.location.pathname

              if (currentPath.includes("/chats")) {
                window.location.href = "/account"
              } else {
                window.location.href = "/chats"
              }
            }}
            variant="outline"
          >
            <Home className="h-4 w-4 text-muted-foreground" />
            Выйти из аварийной зоны
          </Button>
        </div>
      </div>
    </div>
  )
}
