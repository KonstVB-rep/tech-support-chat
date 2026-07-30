"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Bell, BellOff, ShieldAlert } from "lucide-react"
import { authClient } from "@/app/lib/auth-client"
import { getIsSupportEngineerAction } from "@/entities/profile/api/getIsSupportEngineerAction"
import { useMyProfile } from "@/entities/profile/api/useMyProfile"
import { Button } from "@/shared/ui/components/button"

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
const PUSH_DISMISSED_KEY = "push-notification-dismissed"

if (typeof window !== "undefined" && !VAPID_PUBLIC_KEY) {
  console.warn("⚠️ Внимание: Переменная NEXT_PUBLIC_VAPID_PUBLIC_KEY отсутствует в файле .env!")
}

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray.buffer as ArrayBuffer
}

const useIsSupportEngineer = () => {
  const { data: session } = authClient.useSession()
  return useQuery({
    queryKey: ["is-support-engineer", session?.user?.id],
    queryFn: () => getIsSupportEngineerAction(),
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    initialData: false,
  })
}

export const PushPermissionGate = () => {
  const [isMounted, setIsMounted] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isResolved, setIsResolved] = useState(false)

  const { data: session } = authClient.useSession()
  const { data: profile } = useMyProfile()
  const { data: isSupportEngineer } = useIsSupportEngineer()

  useEffect(() => {
    setIsMounted(true)

    if ("Notification" in window) {
      // Если разрешение изменилось на не-denied → сбрасываем localStorage
      if (Notification.permission !== "denied") {
        localStorage.removeItem(PUSH_DISMISSED_KEY)
      }

      // Проверяем оба источника: localStorage И реальную подписку
      const dismissed = localStorage.getItem(PUSH_DISMISSED_KEY) === "true"
      const hasSubscription = Notification.permission === "granted"
      setIsResolved(dismissed || hasSubscription)
    }
  }, [])

  const resolvePermanently = () => {
    localStorage.setItem(PUSH_DISMISSED_KEY, "true")
    setIsResolved(true)
  }

  // Синхронизация отказа с сервером
  useEffect(() => {
    if (isMounted && Notification.permission === "denied" && profile?.id) {
      fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id }),
      }).catch(console.error)
    }
  }, [isMounted, profile?.id])

  const handleSubscribe = async () => {
    if (!("Notification" in window)) return
    if (!VAPID_PUBLIC_KEY) return
    try {
      setIsSubscribing(true)
      const perm = await Notification.requestPermission()
      if (perm !== "granted") return

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      })
      if (!res.ok) throw new Error("Ошибка сохранения подписки")

      setIsResolved(true)
    } catch (error) {
      console.error("❌ Ошибка подписки на push:", error)
    } finally {
      setIsSubscribing(false)
    }
  }

  // Читаем permission напрямую — не храним в state
  const permission: NotificationPermission =
    isMounted && "Notification" in window ? Notification.permission : "default"

  if (!isMounted || !session?.user || isResolved || !("Notification" in window)) {
    return null
  }

  // Инженер + denied → обязательная модалка (НЕ скрывается через dismiss)
  if (isSupportEngineer && permission === "denied") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-sm space-y-3 rounded-2xl border border-destructive/30 bg-card p-6">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h2 className="text-center font-bold text-lg">Уведомления заблокированы</h2>
          <p className="text-center text-muted-foreground text-sm">
            Инженеры обязаны получать push-уведомления. Разрешите уведомления в настройках браузера.
          </p>
          <Button
            className="w-full"
            onClick={() => window.open("edge://settings/content/notifications", "_blank")}
          >
            Открыть настройки браузера
          </Button>
        </div>
      </div>
    )
  }

  // Обычный сотрудник + denied → баннер с кнопкой закрытия
  if (!isSupportEngineer && permission === "denied") {
    return (
      <div className="slide-in-from-bottom-4 fixed right-4 bottom-4 z-50 max-w-xs animate-in rounded-2xl border border-border bg-card p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <BellOff className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="flex-1 space-y-2">
            <p className="font-medium text-sm">Уведомления недоступны</p>
            <p className="text-muted-foreground text-xs">
              Браузер заблокировал уведомления. Проверьте настройки в параметрах Windows.
            </p>
            <Button
              className="w-full text-xs"
              onClick={resolvePermanently}
              size="sm"
              variant="outline" // ← Сохраняем в localStorage
            >
              Понятно
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // permission === "default" → баннер с двумя кнопками
  return (
    <div className="slide-in-from-bottom-4 fixed right-4 bottom-4 z-50 z-[999] max-w-xs animate-in rounded-2xl border border-border bg-card p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1 space-y-2">
          <p className="font-medium text-sm">Включить уведомления?</p>
          <p className="text-muted-foreground text-xs">
            {isSupportEngineer
              ? "Инженеры получают обязательные оповещения о новых тикетах"
              : "Получайте оповещения о новых сообщениях"}
          </p>
          <div className="flex gap-2">
            <Button className="flex-1" disabled={isSubscribing} onClick={handleSubscribe} size="sm">
              {isSubscribing ? "Подключение..." : "Разрешить"}
            </Button>
            {!isSupportEngineer && (
              <Button
                className="flex-1"
                disabled={isSubscribing}
                onClick={resolvePermanently} // ← Сохраняем в localStorage
                size="sm"
                variant="outline"
              >
                Нет, спасибо
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
