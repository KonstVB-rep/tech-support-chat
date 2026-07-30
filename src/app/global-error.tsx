"use client"

import { useEffect } from "react"
import { RotateCcw, ShieldAlert } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Critical Global Error:", error)
  }, [error])

  return (
    <html className="dark" lang="ru">
      <body className="grid min-h-dvh w-full place-items-center bg-slate-950 p-4 font-sans text-slate-100 antialiased">
        <div className="zoom-in-95 flex w-full max-w-sm animate-in flex-col items-center rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl duration-200">
          <div className="relative mb-5 rounded-full bg-rose-500/10 p-4 text-rose-400">
            <ShieldAlert className="h-10 w-10 animate-pulse" />
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
            </span>
          </div>

          <h2 className="mb-2 font-bold text-slate-100 text-xl tracking-tight">
            Критический сбой системы
          </h2>
          <p className="mb-6 text-slate-400 text-sm leading-relaxed">
            Приложение временно недоступно. Наша команда инженеров техподдержки уже получила
            уведомление и занимается решением проблемы.
          </p>

          <button
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 font-semibold text-sm text-white shadow-indigo-600/10 shadow-lg transition-all hover:bg-indigo-500 active:scale-[0.98]"
            onClick={() => {
              // Перед мягким перезапуском очищаем битый кэш сессий в селекторах, если он зациклился
              reset()
            }}
            type="button"
          >
            <RotateCcw className="h-4 w-4" />
            Перезапустить приложение
          </button>

          <a
            className="mt-4 text-slate-500 text-xs underline underline-offset-4 transition-colors hover:text-slate-400"
            href="/chats"
          >
            Вернуться в чаты
          </a>
        </div>
      </body>
    </html>
  )
}
