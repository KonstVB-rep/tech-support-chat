"use client";

import { authClient } from "@/app/lib/auth-client";
import { getIsSupportEngineerAction } from "@/entities/profile/api/getIsSupportEngineerAction";
import { Button } from "@/shared/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Bell, BellOff, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useMyProfile } from "@/entities/profile/api/useMyProfile";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const PUSH_DISMISSED_KEY = "push-notification-dismissed";

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

const useIsSupportEngineer = () => {
  const { data: session } = authClient.useSession();
  return useQuery({
    queryKey: ["is-support-engineer", session?.user?.id],
    queryFn: () => getIsSupportEngineerAction(),
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000,
    initialData: false,
  });
};

export const PushPermissionGate = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  const { data: session } = authClient.useSession();
  const { data: profile } = useMyProfile();
  const { data: isSupportEngineer } = useIsSupportEngineer();

  useEffect(() => {
    setIsMounted(true);

    if ("Notification" in window) {
      // Если разрешение изменилось на не-denied → сбрасываем localStorage
      if (Notification.permission !== "denied") {
        localStorage.removeItem(PUSH_DISMISSED_KEY);
      }

      // Проверяем оба источника: localStorage И реальную подписку
      const dismissed = localStorage.getItem(PUSH_DISMISSED_KEY) === "true";
      const hasSubscription = Notification.permission === "granted";
      setIsResolved(dismissed || hasSubscription);
    }
  }, []);

  const resolvePermanently = () => {
    localStorage.setItem(PUSH_DISMISSED_KEY, "true");
    setIsResolved(true);
  };

  // Синхронизация отказа с сервером
  useEffect(() => {
    if (isMounted && Notification.permission === "denied" && profile?.id) {
      fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profile.id }),
      }).catch(console.error);
    }
  }, [isMounted, profile?.id]);

  const handleSubscribe = async () => {
    if (!("Notification" in window)) return;
    try {
      setIsSubscribing(true);
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription.toJSON()),
      });
      if (!res.ok) throw new Error("Ошибка сохранения подписки");

      setIsResolved(true);
    } catch (error) {
      console.error("❌ Ошибка подписки на push:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Читаем permission напрямую — не храним в state
  const permission: NotificationPermission =
    isMounted && "Notification" in window ? Notification.permission : "default";

  if (
    !isMounted ||
    !session?.user ||
    isResolved ||
    !("Notification" in window)
  ) {
    return null;
  }

  // Инженер + denied → обязательная модалка (НЕ скрывается через dismiss)
  if (isSupportEngineer && permission === "denied") {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl p-6 max-w-sm w-full space-y-3 border border-destructive/30">
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto" />
          <h2 className="text-lg font-bold text-center">
            Уведомления заблокированы
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            Инженеры обязаны получать push-уведомления. Разрешите уведомления в
            настройках браузера.
          </p>
          <Button
            onClick={() =>
              window.open("edge://settings/content/notifications", "_blank")
            }
            className="w-full"
          >
            Открыть настройки браузера
          </Button>
        </div>
      </div>
    );
  }

  // Обычный сотрудник + denied → баннер с кнопкой закрытия
  if (!isSupportEngineer && permission === "denied") {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-2xl p-4 shadow-xl max-w-xs animate-in slide-in-from-bottom-4">
        <div className="flex items-start gap-3">
          <BellOff className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium">Уведомления недоступны</p>
            <p className="text-xs text-muted-foreground">
              Браузер заблокировал уведомления. Проверьте настройки в параметрах
              Windows.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              onClick={resolvePermanently} // ← Сохраняем в localStorage
            >
              Понятно
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // permission === "default" → баннер с двумя кнопками
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-2xl p-4 shadow-xl max-w-xs animate-in slide-in-from-bottom-4 z-[999]">
      <div className="flex items-start gap-3">
        <Bell className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium">Включить уведомления?</p>
          <p className="text-xs text-muted-foreground">
            {isSupportEngineer
              ? "Инженеры получают обязательные оповещения о новых тикетах"
              : "Получайте оповещения о новых сообщениях"}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="flex-1"
            >
              {isSubscribing ? "Подключение..." : "Разрешить"}
            </Button>
            {!isSupportEngineer && (
              <Button
                size="sm"
                variant="outline"
                onClick={resolvePermanently} // ← Сохраняем в localStorage
                disabled={isSubscribing}
                className="flex-1"
              >
                Нет, спасибо
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
