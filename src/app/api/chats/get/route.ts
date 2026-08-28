// src/app/api/chats/get/route.ts

import { Prisma } from "@prisma/client"
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

    const isStaffMember = await prisma.staffMember.findUnique({
      where: { profileId: userProfile.id },
    })
    const isGlobalAdmin = session.user.role.toLowerCase() === "admin"

    const chatInclude = {
      creator: { select: { id: true, name: true, imageUrl: true } },
      organization: {
        select: {
          id: true,
          name: true,
          isActive: true,
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

    if (isGlobalAdmin || isStaffMember) {
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

    const chatIds = chats.map((c) => c.id)

    const unreadCountsRaw =
      chatIds.length > 0
        ? await prisma.$queryRaw<Array<{ chatId: string; count: bigint }>>`
      SELECT 
        m.chatId AS chatId,
        COUNT(*) AS count
      FROM message m
      INNER JOIN chat_member cm 
        ON cm.chatId = m.chatId 
        AND cm.profileId = ${userProfile.id}
      WHERE m.chatId IN (${Prisma.join(chatIds)})
        AND m.profileId != ${userProfile.id}
        AND (cm.lastReadAt IS NULL OR m.createdAt > cm.lastReadAt)
      GROUP BY m.chatId
    `
        : []

    const unreadCountMap = new Map(unreadCountsRaw.map((row) => [row.chatId, Number(row.count)]))

    const now = new Date()

    const chatsWithUnread = chats.map((chat) => {
      const lastMessage = chat.messages?.[0] ?? null

      const isContractActive =
        !chat.organization ||
        (chat.organization.isActive &&
          now >= new Date(chat.organization.contractStart) &&
          now <= new Date(chat.organization.contractEnd))

      const orgMemberRole = chat.organization?.members?.[0]?.role ?? null

      return {
        ...chat,
        lastMessage,
        messages: undefined,
        members: undefined,
        unreadCount: unreadCountMap.get(chat.id) ?? 0,
        isContractActive,
        memberRole: orgMemberRole,
      }
    })

    return NextResponse.json({ chats: chatsWithUnread })
  } catch (error) {
    console.error("Ошибка загрузки чатов:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
