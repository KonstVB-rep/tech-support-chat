// app/global-error.tsx
"use client"

import { useEffect } from "react"
import { RotateCcw, ShieldAlert } from "lucide-react"
import { Button } from "@/shared/ui/components/button"

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    console.error("CRITICAL GLOBAL ERROR:", error)
  }, [error])

  const handleRecovery = () => {
    window.location.reload()
  }

  return (
    <html lang="ru" suppressHydrationWarning>
      {" "}
      {/* Убрали хардкод dark, пусть берется из ОС или next-themes */}
      <head>
        <title>Критическая ошибка | НазваниеТвоегоПриложения</title>
      </head>
      <body className="grid min-h-dvh w-full place-items-center bg-background p-4 font-sans text-foreground antialiased">
        <div className="zoom-in-95 flex w-full max-w-sm animate-in flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-2xl duration-200">
          <div className="relative mb-5 rounded-full bg-destructive/10 p-4 text-destructive">
            <ShieldAlert className="h-10 w-10 animate-pulse" />
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive" />
            </span>
          </div>

          <h2 className="mb-2 font-bold text-xl tracking-tight">Критический сбой системы</h2>
          <p className="mb-6 text-muted-foreground text-sm leading-relaxed">
            Приложение временно недоступно. Мы уже знаем о проблеме и работаем над её решением.
          </p>

          <Button
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground text-sm shadow-lg transition-all hover:bg-primary/90 active:scale-[0.98]"
            onClick={handleRecovery}
          >
            <RotateCcw className="h-4 w-4" />
            Перезапустить приложение
          </Button>
        </div>
      </body>
    </html>
  )
}
