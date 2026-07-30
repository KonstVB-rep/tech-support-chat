"use client"

import { useEffect, useState } from "react"
import { Loader2, Monitor, Smartphone, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/components/card"
import { getActiveSessions, revokeSessionAction } from "../api/activeSessions"

type Session = {
  id: string
  token: string
  userId: string
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

export const ActiveSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [revokingId, setRevokingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchSessions = async () => {
      try {
        const data = await getActiveSessions()
        if (!cancelled) {
          setSessions(data as unknown as Session[])
        }
      } catch {
        if (!cancelled) {
          toast.error("Не удалось загрузить сессии")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchSessions()

    return () => {
      cancelled = true
    }
  }, [])

  const handleRevoke = async (sessionId: string) => {
    setRevokingId(sessionId) // Включаем лоадер только для этой кнопки
    try {
      await revokeSessionAction(sessionId)
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      toast.success("Сессия успешно отозвана")
    } catch {
      toast.error("Не удалось отозвать сессию")
    } finally {
      setRevokingId(null)
    }
  }

  const parseSession = (ua?: string | null) => {
    if (!ua)
      return {
        device: "Неизвестное устройство",
        browser: "Неизвестно",
        Icon: Monitor,
      }

    const lower = ua.toLowerCase()
    const isMobile =
      lower.includes("mobile") || lower.includes("android") || lower.includes("iphone")
    const Icon = isMobile ? Smartphone : Monitor
    const device = isMobile ? "Мобильное устройство" : "Компьютер"

    let browser = "Браузер"
    if (lower.includes("firefox/")) browser = "Firefox"
    else if (lower.includes("edg/")) browser = "Edge"
    else if (lower.includes("opr/") || lower.includes("opera")) browser = "Opera"
    else if (lower.includes("chrome/")) browser = "Chrome"
    else if (lower.includes("safari/")) browser = "Safari"

    return { device, browser, Icon }
  }

  if (isLoading) return <ActiveSessionsSkeleton />

  return (
    <Card className="w-full max-w-2xl border-none bg-transparent p-0 shadow-none">
      <CardHeader className="sr-only p-0">
        <CardTitle className="font-medium text-lg">Активные сессии</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-0">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-sm">Нет других активных сессий</p>
        ) : (
          sessions.map((session) => {
            const { device, browser, Icon } = parseSession(session.userAgent)
            const isCurrentRevoking = revokingId === session.id

            return (
              <div
                className="flex items-center justify-between rounded-xl border border-border/50 bg-card/30 p-4 backdrop-blur-xs transition-all hover:bg-card/50"
                key={session.id}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="shrink-0 rounded-lg bg-muted p-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-semibold text-sm">{device}</span>
                    <span className="truncate text-muted-foreground text-xs">
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
                  className="rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  disabled={revokingId !== null}
                  onClick={() => handleRevoke(session.id)}
                  size="icon"
                  variant="ghost"
                >
                  {isCurrentRevoking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

export const ActiveSessionsSkeleton = () => {
  return (
    <Card className="w-full max-w-2xl animate-pulse select-none border-none bg-transparent p-0 shadow-none">
      <CardHeader className="px-0 pt-0">
        <div className="h-6 w-36 rounded-md bg-muted" />
      </CardHeader>
      <CardContent className="space-y-3 px-0">
        {[1, 2, 3].map((i) => (
          <div
            className="flex items-center justify-between rounded-xl border border-border/40 bg-card/10 p-4"
            key={i}
          >
            <div className="flex w-full items-center gap-4">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-muted p-2" />

              <div className="flex w-full max-w-[240px] flex-col gap-2">
                <div className="h-4 w-28 rounded-md bg-muted" />
                <div className="h-3 w-full rounded-md bg-muted" />
              </div>
            </div>

            <div className="h-9 w-9 shrink-0 rounded-lg bg-muted/40" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
