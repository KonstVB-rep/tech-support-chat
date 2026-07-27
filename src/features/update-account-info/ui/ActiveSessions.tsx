"use client";

import { Monitor, Smartphone, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { getActiveSessions, revokeSessionAction } from "../api/activeSessions";
import { ChevronRight } from "lucide-react";

type Session = {
  id: string;
  token: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
};

export const ActiveSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ИСПРАВЛЕНО: Храним ID конкретной сессии, которая сейчас удаляется
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const data = await getActiveSessions();
      setSessions(data as unknown as Session[]);
    } catch {
      toast.error("Не удалось загрузить сессии");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (sessionId: string) => {
    setRevokingId(sessionId); // Включаем лоадер только для этой кнопки
    try {
      await revokeSessionAction(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success("Сессия успешно отозвана");
    } catch {
      toast.error("Не удалось отозвать сессию");
    } finally {
      setRevokingId(null);
    }
  };

  const parseSession = (ua?: string | null) => {
    if (!ua)
      return {
        device: "Неизвестное устройство",
        browser: "Неизвестно",
        Icon: Monitor,
      };

    const lower = ua.toLowerCase();
    const isMobile =
      lower.includes("mobile") ||
      lower.includes("android") ||
      lower.includes("iphone");
    const Icon = isMobile ? Smartphone : Monitor;
    const device = isMobile ? "Мобильное устройство" : "Компьютер";

    let browser = "Браузер";
    if (lower.includes("firefox/")) browser = "Firefox";
    else if (lower.includes("edg/")) browser = "Edge";
    else if (lower.includes("opr/") || lower.includes("opera"))
      browser = "Opera";
    else if (lower.includes("chrome/")) browser = "Chrome";
    else if (lower.includes("safari/")) browser = "Safari";

    return { device, browser, Icon };
  };

  if (isLoading) return <ActiveSessionsSkeleton />;

  return (
    <Card className="w-full max-w-2xl bg-transparent border-none shadow-none p-0">
      <CardHeader className="p-0 sr-only">
        <CardTitle className="text-lg font-medium">Активные сессии</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-0">
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Нет других активных сессий
          </p>
        ) : (
          sessions.map((session) => {
            const { device, browser, Icon } = parseSession(session.userAgent);
            const isCurrentRevoking = revokingId === session.id;

            return (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-xl border border-border/50 p-4 bg-card/30 backdrop-blur-xs transition-all hover:bg-card/50"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate">
                      {device}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {browser} · {session.ipAddress || "127.0.0.1"} ·{" "}
                      {new Date(session.createdAt).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRevoke(session.id)}
                  disabled={revokingId !== null}
                  className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-lg"
                >
                  {isCurrentRevoking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export const ActiveSessionsSkeleton = () => {
  return (
    <Card className="w-full max-w-2xl bg-transparent border-none shadow-none p-0 animate-pulse select-none">
      <CardHeader className="px-0 pt-0">
        <div className="h-6 w-36 bg-muted rounded-md" />
      </CardHeader>
      <CardContent className="space-y-3 px-0">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-border/40 p-4 bg-card/10"
          >
            <div className="flex items-center gap-4 w-full">
              <div className="p-2 rounded-lg bg-muted shrink-0 w-9 h-9" />

              <div className="flex flex-col gap-2 w-full max-w-[240px]">
                <div className="h-4 w-28 bg-muted rounded-md" />
                <div className="h-3 w-full bg-muted rounded-md" />
              </div>
            </div>

            <div className="w-9 h-9 bg-muted/40 rounded-lg shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
