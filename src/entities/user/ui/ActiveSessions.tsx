"use client";

import { useEffect, useState, useTransition } from "react";
import { getActiveSessions, revokeSessionAction } from "@/entities/user/api/activeSessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Loader2, Monitor, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Session = {
  id: string;
  token: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}
export  const ActiveSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

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

  console.log("sessions", sessions);

  const handleRevoke = (sessionId: string) => {
    startTransition(async () => {
      try {
        await revokeSessionAction(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        toast.success("Сессия отозвана");
      } catch {
        toast.error("Не удалось отозвать сессию");
      }
    });
  };

const parseSession = (ua?: string | null) => {
  if (!ua) return { device: "Неизвестное устройство", browser: "Неизвестно", Icon: Monitor };

  const lower = ua.toLowerCase();

  const isMobile = lower.includes("mobile") || lower.includes("android") || lower.includes("iphone");
  const Icon = isMobile ? Smartphone : Monitor;
  const device = isMobile ? "Мобильное устройство" : "Компьютер";

  let browser = "Браузер";
  if (lower.includes("firefox/")) browser = "Firefox";
  else if (lower.includes("edg/")) browser = "Edge";
  else if (lower.includes("opr/") || lower.includes("opera")) browser = "Opera";
  else if (lower.includes("chrome/") && !lower.includes("edg/")) browser = "Chrome";
  else if (lower.includes("safari/") && !lower.includes("chrome/")) browser = "Safari";
  else if (lower.includes("msie") || lower.includes("trident/")) browser = "Internet Explorer";

  return { device, browser, Icon };
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Активные сессии</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет активных сессий</p>
        ) : (
          sessions.map((session) => {
          const { device, browser, Icon } = parseSession(session.userAgent);
          return (
            <div key={session.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{device}</span>
                  <span className="text-xs text-muted-foreground">
                    {browser} · {session.ipAddress || "IP не определён"} ·{" "}
                    {new Date(session.createdAt).toLocaleDateString("ru-RU")}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRevoke(session.token)}
                disabled={isPending}
              >
                {isPending ? (
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

