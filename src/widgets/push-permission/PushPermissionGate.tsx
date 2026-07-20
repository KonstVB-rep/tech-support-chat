"use client";

import { authClient } from "@/app/lib/auth-client";
import { getIsSupportEngineerAction } from "@/entities/profile/api/getIsSupportEngineerAction";
import { Button } from "@/shared/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Bell, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

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
  // ✅ Ключевое исправление: не рендерим ничего пока компонент не смонтирован в браузере
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = authClient.useSession();
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { data: isSupportEngineer } = useIsSupportEngineer();

  useEffect(() => {
    setIsMounted(true);
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      const perm = await Notification.requestPermission();
      setPermission(perm);
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
      console.log("✅ Push-подписка сохранена");
    } catch (error) {
      console.error("❌ Ошибка подписки на push:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (
    !isMounted ||
    !session?.user ||
    permission === "granted" ||
    !("Notification" in window)
  ) {
    return null;
  }

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
          <p className="text-xs text-muted-foreground text-center mt-2">
            Настройки → Конфиденциальность → Уведомления → Разрешить для этого
            сайта
          </p>
          <Button
            onClick={() =>
              window.open("chrome://settings/content/notifications", "_blank")
            }
            className="w-full"
          >
            Открыть настройки браузера
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-card border border-border rounded-2xl p-4 shadow-xl max-w-xs animate-in slide-in-from-bottom-4">
      <div className="flex items-start gap-3">
        <Bell className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm font-medium">Включить уведомления?</p>
          <p className="text-xs text-muted-foreground">
            {isSupportEngineer
              ? "Инженеры получают обязательные оповещения о новых тикетах"
              : "Получайте оповещения о новых сообщениях"}
          </p>
          <Button
            size="sm"
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="w-full"
          >
            {isSubscribing ? "Подключение..." : "Разрешить"}
          </Button>
        </div>
      </div>
    </div>
  );
};
