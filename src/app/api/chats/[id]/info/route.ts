// src/app/api/chats/[id]/info/route.ts

import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { id: chatId } = await params

    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { supportEngineer: true },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 })
    }

    const isGlobalAdmin = session.user.role.toLowerCase() === "admin"
    const isSupportEngineer = !!userProfile.supportEngineer

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
        members: {
          where: { profileId: userProfile.id },
          select: { profileId: true },
        },
      },
    })

    if (!chat) {
      return NextResponse.json({ error: "Чат не найден" }, { status: 404 })
    }

    const hasAccess = isGlobalAdmin || isSupportEngineer || chat.members.length > 0

    if (!hasAccess) {
      return NextResponse.json({ error: "Нет доступа к чату" }, { status: 403 })
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
