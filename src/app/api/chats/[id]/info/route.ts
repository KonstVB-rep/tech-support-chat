// src/app/api/chats/[id]/info/route.ts
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"
import { checkChatAccess } from "@/shared/lib/checkChatAccess"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { id: chatId } = await params

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

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            contractStart: true,
            contractEnd: true,
          },
        },
      },
    })

    if (!chat) {
      return NextResponse.json({ error: "Чат не найден" }, { status: 404 })
    }

    const now = new Date()
    const isContractActive =
      !chat.organization ||
      (now >= new Date(chat.organization.contractStart) &&
        now <= new Date(chat.organization.contractEnd))

    return NextResponse.json({
      chat: {
        id: chat.id,
        title: chat.title,
        imageUrl: chat.imageUrl,
        type: chat.type,
        organizationId: chat.organizationId,
        organization: chat.organization,
        isContractActive,
      },
    })
  } catch (error) {
    console.error("Ошибка получения инфо чата:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
