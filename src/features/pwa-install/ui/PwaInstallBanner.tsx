"use client"
import { useEffect, useState } from "react"
import { Button } from "@/shared/ui/components/button"

// Описываем тип для события браузера, так как в стандартном TS его нет
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Блокируем стандартное всплывающее окно браузера
      e.preventDefault()
      // Сохраняем событие, чтобы вызвать его позже по клику на кнопку
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Показываем наш красивый баннер
      setIsVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Если приложение УЖЕ установлено, скрываем баннер
    window.addEventListener("appinstalled", () => {
      setIsVisible(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Показываем системное окно установки
    await deferredPrompt.prompt()

    // Ждем выбора пользователя (установил или отменил)
    const { outcome } = await deferredPrompt.userChoice
    console.log(`Пользователь выбрал: ${outcome}`)

    // Очищаем стейт, баннер больше не нужен
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  // Если браузер не разрешил установку, ничего не рендерим
  if (!isVisible) return null

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 animate-fade-in-up rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl md:right-4 md:left-auto md:max-w-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white text-xl shadow-md">
          💬
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">Установить чат поддержки</h3>
          <p className="mt-0.5 text-gray-500 text-xs">
            Добавьте приложение на экран для мгновенного доступа и уведомлений.
          </p>

          <div className="mt-3 flex gap-2">
            <Button
              className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white text-xs shadow-sm transition-colors hover:bg-blue-700"
              onClick={handleInstallClick}
            >
              Установить
            </Button>
            <Button
              className="rounded-xl bg-gray-100 px-4 py-2 font-medium text-gray-600 text-xs transition-colors hover:bg-gray-200"
              onClick={() => setIsVisible(false)}
            >
              Позже
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
