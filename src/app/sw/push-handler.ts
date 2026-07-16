/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

interface PushNotificationOptions extends NotificationOptions {
  vibrate?: number | number[];
  renotify?: boolean;
  tag?: string;
  data?: Record<string, unknown>;
}

self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  const title: string = data.title || "Уведомление";
  const options: PushNotificationOptions = {
    body: data.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || "default",
    renotify: true,
    data: { url: data.url },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data as Record<string, string>)?.url || "/";
  event.waitUntil(self.clients.openWindow(url));
});

export {};
