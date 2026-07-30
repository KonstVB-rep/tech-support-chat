// src/app/api/chats/get/route.ts

import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: { organizationMembers: true },
    })

    if (!userProfile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 })
    }

    const isSupportEngineer = await prisma.supportEngineer.findUnique({
      where: { profileId: userProfile.id },
    })
    const isGlobalAdmin = session.user.role.toLowerCase() === "admin"

    const chatInclude = {
      creator: { select: { id: true, name: true, imageUrl: true } },
      organization: {
        select: {
          id: true,
          name: true,
          contractStart: true,
          contractEnd: true,
          members: {
            where: { profileId: userProfile.id },
            select: { role: true },
          },
        },
      },
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: "desc" as const },
        take: 1,
        select: {
          text: true,
          attachments: true,
          createdAt: true,
          profile: { select: { name: true, userId: true } },
        },
      },
      members: {
        where: { profileId: userProfile.id },
        select: { lastReadAt: true },
      },
    }

    let chats = []

    if (isGlobalAdmin || isSupportEngineer) {
      chats = await prisma.chat.findMany({
        orderBy: { updatedAt: "desc" },
        include: chatInclude,
      })
    } else {
      const managedOrgIds = userProfile.organizationMembers
        .filter((m) => m.role === "RESPONSIBLE")
        .map((m) => m.organizationId)

      chats = await prisma.chat.findMany({
        where: {
          OR: [
            { organizationId: { in: managedOrgIds } },
            { members: { some: { profileId: userProfile.id } } },
          ],
        },
        orderBy: { updatedAt: "desc" },
        include: chatInclude,
      })
    }

    const now = new Date()

    // ✅ Точный подсчёт непрочитанных через отдельные запросы
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const member = chat.members?.[0]
        const lastReadAt = member?.lastReadAt
        const lastMessage = chat.messages?.[0] || null

        let unreadCount = 0

        if (lastReadAt) {
          unreadCount = await prisma.message.count({
            where: {
              chatId: chat.id,
              createdAt: { gt: lastReadAt },
              profileId: { not: userProfile.id },
            },
          })
        } else {
          unreadCount = await prisma.message.count({
            where: {
              chatId: chat.id,
              profileId: { not: userProfile.id },
            },
          })
        }

        const isContractActive =
          !chat.organization ||
          (now >= new Date(chat.organization.contractStart) &&
            now <= new Date(chat.organization.contractEnd))

        const orgMemberRole = chat.organization?.members?.[0]?.role ?? null

        return {
          ...chat,
          lastMessage,
          messages: undefined,
          members: undefined,
          unreadCount,
          isContractActive,
          memberRole: orgMemberRole,
        }
      }),
    )

    return NextResponse.json({ chats: chatsWithUnread })
  } catch (error) {
    console.error("Ошибка загрузки чатов:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
