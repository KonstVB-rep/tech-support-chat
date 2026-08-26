// src/app/api/chats/[id]/messages/route.ts

import crypto from "node:crypto"
import fs from "node:fs/promises"
import path from "node:path"
import type { Prisma } from "@prisma/client"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"
import { checkChatAccess } from "@/shared/lib/checkChatAccess"
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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: chatId } = await params
    const { searchParams } = new URL(req.url)

    // Cursor-based пагинация (для бесконечного скролла вверх)
    const cursor = searchParams.get("cursor") // ID последнего загруженного сообщения
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100) // Макс 100 за раз

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

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        profile: {
          select: { id: true, name: true, userId: true, imageUrl: true },
        },
        replyTo: {
          select: {
            id: true,
            text: true,
            attachments: true,
            profile: { select: { name: true } },
          },
        },
      },
    })

    // Определяем, есть ли еще сообщения
    const hasMore = messages.length > limit
    const paginatedMessages = hasMore ? messages.slice(0, limit) : messages

    // Разворачиваем в хронологическом порядке (старые → новые)
    paginatedMessages.reverse()

    const chatInfo = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        id: true,
        title: true,
        organizationId: true,
        organization: { select: { name: true } },
      },
    })

    const mappedMessages = paginatedMessages.map((msg) => ({
      ...msg,
      sender: msg.profile.userId === session.user.id ? "user" : "support",
      senderName: msg.profile.name || "Участник",
      timestamp: msg.createdAt.toISOString(),
      attachments: msg.attachments || [],
      replyTo: msg.replyTo
        ? {
            id: msg.replyTo.id,
            text: msg.replyTo.text,
            senderName: msg.replyTo.profile?.name || "Участник",
            attachments: msg.replyTo.attachments || [],
          }
        : null,
    }))

    return NextResponse.json({
      messages: mappedMessages,
      chat: chatInfo,
      hasMore,
      nextCursor: hasMore ? paginatedMessages[0]?.id : null, // Cursor для следующего запроса
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
    const rawReplyToId = formData.get("replyToId") as string | null

    if ((!text || !text.trim()) && files.length === 0) {
      return NextResponse.json({ error: "Сообщение пустое" }, { status: 400 })
    }

    // Проверка replyToId (безопасность)
    let validReplyToId: string | null = null
    if (rawReplyToId) {
      const parentMessage = await prisma.message.findUnique({
        where: { id: rawReplyToId },
        select: { chatId: true },
      })
      if (parentMessage && parentMessage.chatId === chatId) {
        validReplyToId = rawReplyToId
      }
    }

    // Ограничение размера файлов (те же 50MB что и в media-upload)
    const MAX_FILE_SIZE = 50 * 1024 * 1024
    const attachments: AttachmentMeta[] = []

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Файл ${file.name} превышает лимит 50MB` },
          { status: 400 },
        )
      }

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

    // Транзакция: создание сообщения + обновление чата
    const [message, chatInfo] = await prisma.$transaction([
      prisma.message.create({
        data: {
          text: text?.trim() || "",
          chatId,
          profileId: userProfile.id,
          attachments: attachments as unknown as Prisma.InputJsonValue,
          replyToId: validReplyToId,
        },
        include: {
          profile: {
            select: { id: true, name: true, userId: true, imageUrl: true },
          },
          replyTo: {
            select: {
              id: true,
              text: true,
              attachments: true,
              profile: { select: { name: true } },
            },
          },
        },
      }),
      prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
        select: { organizationId: true },
      }),
    ])

    const mappedMessage = {
      ...message,
      createdAt: message.createdAt.toISOString(),
      attachments: message.attachments || [],
      replyTo: message.replyTo
        ? {
            id: message.replyTo.id,
            text: message.replyTo.text,
            senderName: message.replyTo.profile?.name || "Участник",
            attachments: message.replyTo.attachments || [],
          }
        : null,
    }

    await triggerSocketEvent("srv:message:new", {
      message: mappedMessage,
      organizationId: chatInfo?.organizationId || null,
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error)
    return NextResponse.json({ error: "Ошибка сервера при отправке" }, { status: 500 })
  }
}
