// src/app/api/chats/create/route.ts

import type { ChatRole } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"
import { triggerSocketEvent } from "@/shared/lib/socket-trigger"

const createChatSchema = z.object({
  title: z.string().min(1, "Название темы обязательно").max(200),
  organizationId: z.string().cuid("Некорректный ID организации"),
})

export const POST = async (request: Request) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user || session.user.role.toLowerCase() !== "admin") {
      return NextResponse.json(
        {
          error: "Доступ запрещен. Только администратор системы может создавать новые темы.",
        },
        { status: 403 },
      )
    }

    const body = await request.json()
    const validation = createChatSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: "Невалидные данные", details: validation.error.format() },
        { status: 400 },
      )
    }

    const { title, organizationId } = validation.data

    const adminProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!adminProfile) {
      return NextResponse.json({ error: "Профиль администратора не найден" }, { status: 404 })
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        isActive: true,
        contractStart: true,
        contractEnd: true,
      },
    })

    if (!organization) {
      return NextResponse.json({ error: "Организация не найдена" }, { status: 404 })
    }

    if (!organization.isActive) {
      return NextResponse.json(
        { error: "Обслуживание организации временно приостановлено" },
        { status: 403 },
      )
    }

    const now = new Date()
    if (now < organization.contractStart || now > organization.contractEnd) {
      return NextResponse.json({ error: "Договор с организацией не активен" }, { status: 403 })
    }

    const newChat = await prisma.$transaction(async (tx) => {
      const chat = await tx.chat.create({
        data: {
          title: title.trim(),
          type: "GROUP",
          creatorId: adminProfile.id,
          organizationId,
        },
      })

      const activeStaffMember = await tx.staffMember.findMany({
        where: {
          profile: {
            user: { isActive: true },
          },
        },
        select: { profileId: true },
      })

      const clientMembers = await tx.organizationMember.findMany({
        where: {
          organizationId,
          role: "RESPONSIBLE",
        },
        select: { profileId: true },
      })

      const staffMembersProfileIds = new Set(activeStaffMember.map((e) => e.profileId))

      const allUniqueProfileIds = Array.from(
        new Set([
          adminProfile.id,
          ...staffMembersProfileIds,
          ...clientMembers.map((m) => m.profileId),
        ]),
      )

      const membersData = allUniqueProfileIds.map((profileId) => ({
        chatId: chat.id,
        profileId,
        role: (staffMembersProfileIds.has(profileId) || profileId === adminProfile.id
          ? "ADMIN"
          : "MEMBER") as ChatRole,
      }))

      await tx.chatMember.createMany({
        data: membersData,
      })

      return chat
    })

    const chatResponse = {
      ...newChat,
      _count: { messages: 0 },
      organization: {
        id: organization.id,
        name: organization.name,
      },
      creator: {
        id: adminProfile.id,
        name: adminProfile.name,
        imageUrl: adminProfile.imageUrl,
      },
    }

    await triggerSocketEvent("srv:chat:new", {
      chat: chatResponse,
      organizationId,
    })

    return NextResponse.json(chatResponse)
  } catch (error) {
    console.error("Ошибка при создании темы техподдержки:", error)

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json({ error: "Чат с таким названием уже существует" }, { status: 409 })
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
