// src/app/api/chats/[id]/read/route.ts

import { Prisma } from "@prisma/client"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"
import { checkChatAccess } from "@/shared/lib/checkChatAccess"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: chatId } = await params

    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })
    if (!userProfile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 })
    }

    const access = await checkChatAccess(chatId, session, userProfile.id, {
      checkContract: false,
    })
    if (!access.allowed) {
      return NextResponse.json({ error: access.error }, { status: access.status ?? 403 })
    }

    await prisma.chatMember.update({
      where: {
        chatId_profileId: { chatId, profileId: userProfile.id },
      },
      data: { lastReadAt: new Date() },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Ошибка пометки чата как прочитанного:", error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
