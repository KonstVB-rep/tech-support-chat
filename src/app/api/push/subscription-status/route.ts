// src/app/api/push/subscription-status/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/prisma/prisma-client"
import { getSession } from "@/shared/lib/server-current-user"

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ hasSubscription: false })
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { pushSubscription: true },
    })

    return NextResponse.json({
      hasSubscription: !!profile?.pushSubscription,
    })
  } catch (e) {
    console.error("Ошибка проверки push-подписки:", e)
    return NextResponse.json({ hasSubscription: false })
  }
}
