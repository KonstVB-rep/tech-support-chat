// /api/push/subscribe
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma/prisma-client"
import { getSession } from "@/shared/lib/server-current-user"

export async function POST(request: NextRequest) {
  console.log("🔔 [PUSH SUBSCRIBE] Запрос получен")

  try {
    const session = await getSession()
    console.log("🔔 [PUSH SUBSCRIBE] Сессия:", session?.user?.id || "НЕТ")

    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })
    console.log("🔔 [PUSH SUBSCRIBE] Профиль:", profile?.id || "НЕ НАЙДЕН")

    if (!profile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 })
    }

    const subscription = await request.json()
    console.log("🔔 [PUSH SUBSCRIBE] Подписка:", JSON.stringify(subscription).substring(0, 100))

    await prisma.profile.update({
      where: { id: profile.id },
      data: { pushSubscription: subscription },
    })
    console.log("✅ [PUSH SUBSCRIBE] Успешно сохранено для профиля:", profile.id)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("❌ [PUSH SUBSCRIBE] Ошибка:", e)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
