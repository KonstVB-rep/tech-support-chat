"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Bell, BellOff, ShieldAlert } from "lucide-react"
import { authClient } from "@/app/lib/auth-client"
import { getIsStaffMemberAction } from "@/entities/profile/api/getIsStaffMemberAction"
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

const useIsStaffMember = () => {
  const { data: session } = authClient.useSession()
  return useQuery({
    queryKey: ["is-staff", session?.user?.id],
    queryFn: () => getIsStaffMemberAction(),
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
  const { data: isStaffMember } = useIsStaffMember()

  const {
    data: subscriptionStatus,
    isLoading: isCheckingSubscription,
    fetchStatus,
  } = useQuery({
    queryKey: ["push-subscription-status", profile?.id],
    queryFn: () => fetch("/api/push/subscription-status").then((r) => r.json()),
    enabled:
      typeof window !== "undefined" && !!profile?.id && Notification.permission === "granted",
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    setIsMounted(true)

    if ("Notification" in window && Notification.permission !== "denied") {
      localStorage.removeItem(PUSH_DISMISSED_KEY)
    }

    const dismissed = localStorage.getItem(PUSH_DISMISSED_KEY) === "true"
    if (dismissed) {
      setIsResolved(true)
    }
  }, [])

  useEffect(() => {
    if (subscriptionStatus?.hasSubscription) {
      setIsResolved(true)
    }
  }, [subscriptionStatus])

  const resolvePermanently = () => {
    localStorage.setItem(PUSH_DISMISSED_KEY, "true")
    setIsResolved(true)
  }

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
      if (perm !== "granted") {
        setIsResolved(false)
        return
      }

      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<ServiceWorkerRegistration>((_, reject) =>
          setTimeout(() => reject(new Error("SW не готов (таймаут 5с)")), 5000),
        ),
      ])

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      try {
        const res = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription.toJSON()),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          console.error("❌ Ошибка API подписки:", res.status, errorData)
          return
        }

        setIsResolved(true)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          console.error("❌ Таймаут запроса подписки")
        } else {
          console.error("❌ Ошибка сети при подписке:", fetchError)
        }
      }
    } catch (error) {
      console.error("❌ Ошибка подписки на push:", error)
    } finally {
      setIsSubscribing(false)
    }
  }

  const isChecking = !isMounted || isCheckingSubscription || fetchStatus === "idle"

  if (isChecking || !session?.user || isResolved) {
    return null
  }

  const permission: NotificationPermission =
    "Notification" in window ? Notification.permission : "default"

  if (!("Notification" in window)) {
    return null
  }

  if (isStaffMember && permission === "denied") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-sm space-y-3 rounded-2xl border border-destructive/30 bg-card p-6">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h2 className="text-center font-bold text-lg">Уведомления заблокированы</h2>
          <p className="text-center text-muted-foreground text-sm">
            Сотрудники тех поддержки обязаны получать push-уведомления. Разрешите уведомления в
            настройках браузера.
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

  if (!isStaffMember && permission === "denied") {
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
              variant="outline"
            >
              Понятно
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="slide-in-from-bottom-4 fixed right-4 bottom-4 z-50 z-[999] max-w-xs animate-in rounded-2xl border border-border bg-card p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1 space-y-2">
          <p className="font-medium text-sm">Включить уведомления?</p>
          <p className="text-muted-foreground text-xs">
            {isStaffMember
              ? "Сотрудники техподдержки получают обязательные оповещения о новых тикетах"
              : "Получайте оповещения о новых сообщениях"}
          </p>
          <div className="flex gap-2">
            <Button className="flex-1" disabled={isSubscribing} onClick={handleSubscribe} size="sm">
              {isSubscribing ? "Подключение..." : "Разрешить"}
            </Button>
            {!isStaffMember && (
              <Button
                className="flex-1"
                disabled={isSubscribing}
                onClick={resolvePermanently}
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
