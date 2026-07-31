// src/app/api/chats/[id]/messages/route.ts

import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import type { Prisma } from "@prisma/client"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"
import { triggerSocketEvent } from "@/shared/lib/socket-trigger"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/opt/chat-app/uploads"

function guessMimeType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase()
  const map: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    pdf: "application/pdf",
    zip: "application/zip",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain",
    csv: "text/csv",
  }
  return map[ext || ""] || "application/octet-stream"
}

interface AttachmentMeta {
  url: string
  name: string
  type: string
  size: number
}

async function checkChatAccess(
  chatId: string,
  session: { user: { role: string; id: string } },
  userProfileId: string,
  options: { checkContract: boolean } = { checkContract: true },
) {
  const isGlobalAdmin = session.user.role.toLowerCase() === "admin"
  if (isGlobalAdmin) return { allowed: true }

  const isSupportEngineer = await prisma.supportEngineer.findUnique({
    where: { profileId: userProfileId },
  })
  if (isSupportEngineer) return { allowed: true }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { organization: true },
  })

  if (!chat) return { allowed: false, error: "Чат не найден", status: 404 }

  // ✅ Проверка договора только когда явно запрошена
  if (options.checkContract && chat.organization) {
    const now = new Date()
    if (now < chat.organization.contractStart || now > chat.organization.contractEnd) {
      return { allowed: false, error: "Договор не активен", status: 403 }
    }
  }

  if (chat.organizationId) {
    const orgMembership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_profileId: {
          organizationId: chat.organizationId,
          profileId: userProfileId,
        },
      },
      select: { role: true },
    })
    if (orgMembership && orgMembership.role === "RESPONSIBLE") {
      return { allowed: true }
    }
  }

  const isChatMember = await prisma.chatMember.findUnique({
    where: { chatId_profileId: { chatId, profileId: userProfileId } },
  })
  if (isChatMember) return { allowed: true }

  return {
    allowed: false,
    error: "Доступ к этому чату заблокирован. Вы не являетесь его участником.",
    status: 403,
  }
}
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: chatId } = await params

    const session = await auth.api.getSession({ headers: await headers() })

    console.log("[messages/route] session:", session?.user?.id ?? "NULL")
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

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            userId: true,
            imageUrl: true,
          },
        },
      },
    })

    const chatInfo = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        id: true,
        title: true,
        organizationId: true,
        organization: { select: { name: true } },
      },
    })

    return NextResponse.json({
      messages: messages || [],
      chat: chatInfo,
    })
  } catch (error) {
    console.error("Ошибка загрузки messages:", error)
    return NextResponse.json({ error: "Ошибка сервера при чтении истории" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      checkContract: true,
    })
    if (!access.allowed) {
      return NextResponse.json({ error: access.error }, { status: access.status ?? 403 })
    }

    const formData = await req.formData()
    const text = formData.get("text") as string | null
    const files = formData.getAll("files") as File[]

    if ((!text || !text.trim()) && files.length === 0) {
      return NextResponse.json({ error: "Сообщение пустое" }, { status: 400 })
    }

    const chatInfo = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { organizationId: true },
    })

    const attachments: AttachmentMeta[] = []

   for (const file of files) {
      const ext = path.extname(file.name)
      const fileName = `${crypto.randomUUID()}${ext}`

      const relativePath = path.join("media", "chats", chatId, fileName)
      const fullPath = path.join(UPLOAD_DIR, relativePath)

      await fs.mkdir(path.dirname(fullPath), { recursive: true })
      const buffer = Buffer.from(await file.arrayBuffer())
      await fs.writeFile(fullPath, buffer)

      const dbUrl = `/uploads/media/chats/${chatId}/${fileName}`

      attachments.push({
        url: dbUrl,
        name: file.name,
        type: file.type || guessMimeType(file.name),
        size: file.size,
      })
    }


    const message = await prisma.message.create({
      data: {
        text: text?.trim() || "",
        chatId,
        profileId: userProfile.id,
        attachments: attachments as unknown as Prisma.InputJsonValue,
      },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            userId: true,
            imageUrl: true,
          },
        },
      },
    })

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    })

    await triggerSocketEvent("srv:message:new", {
      message,
      organizationId: chatInfo?.organizationId || null,
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error)
    return NextResponse.json({ error: "Ошибка сервера при отправке" }, { status: 500 })
  }
}
