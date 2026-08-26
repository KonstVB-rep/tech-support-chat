import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma/prisma-client"

export async function POST(req: NextRequest) {
  try {
    const { profileId } = await req.json()

    if (!profileId) {
      return NextResponse.json({ error: "Missing profileId" }, { status: 400 })
    }

    await prisma.profile.update({
      where: { id: profileId },
      data: {
        pushEnabled: false,
        pushSubscription: undefined,
      },
    })

    console.log(`🔕 [PUSH] Отписка подтверждена для profile:${profileId}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("❌ [PUSH UNSUBSCRIBE] Ошибка:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
