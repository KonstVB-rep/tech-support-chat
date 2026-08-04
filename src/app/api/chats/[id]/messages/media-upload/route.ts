// src/app/api/chats/[id]/messages/media-upload/route.ts

import { randomUUID } from "node:crypto"
import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import type { Prisma } from "@prisma/client"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"
import { triggerSocketEvent } from "@/shared/lib/socket-trigger"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/opt/chat-app/uploads"
const MEDIA_DIR = path.join(UPLOAD_DIR, "media")
const FILES_DIR = path.join(UPLOAD_DIR, "files")
const MAX_FILE_SIZE = 50 * 1024 * 1024
const MAX_FILES_PER_REQUEST = 10

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const VIDEO_TYPES = ["video/mp4", "video/webm"]
const MEDIA_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES]

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

    const isMember = await prisma.chatMember.findUnique({
      where: { chatId_profileId: { chatId, profileId: userProfile.id } },
    })
    const isAdmin = session.user.role.toLowerCase() === "admin"
    const isSupport = await prisma.supportEngineer.findUnique({
      where: { profileId: userProfile.id },
    })

    if (!isMember && !isAdmin && !isSupport) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
    }

    const formData = await req.formData()
    const files = formData.getAll("files") as File[]
    const text = formData.get("text") as string | null
    const replyToId = (formData.get("replyToId") as string) || null

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Файлы не найдены" }, { status: 400 })
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Максимум ${MAX_FILES_PER_REQUEST} файлов за раз` },
        { status: 400 },
      )
    }

    let validReplyToId: string | undefined
    if (replyToId) {
      const parentMessage = await prisma.message.findUnique({
        where: { id: replyToId },
        select: { chatId: true },
      })
      if (parentMessage && parentMessage.chatId === chatId) {
        validReplyToId = replyToId
      }
    }

    const messagesData: Prisma.MessageCreateManyInput[] = []
    const messageIds: string[] = []
    let firstValidFileProcessed = false

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) continue

      const isMedia = MEDIA_TYPES.includes(file.type)
      const baseDir = isMedia ? MEDIA_DIR : FILES_DIR
      const fileType = isMedia ? (IMAGE_TYPES.includes(file.type) ? "image" : "video") : "file"

      const ext = file.name.split(".").pop() || "bin"
      const fileName = `${randomUUID()}.${ext}`
      const targetDir = path.join(baseDir, "chats", chatId)

      await mkdir(targetDir, { recursive: true })

      const filePath = path.join(targetDir, fileName)
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)

      const urlPrefix = isMedia ? "media" : "files"
      const fileUrl = `/uploads/${urlPrefix}/chats/${chatId}/${fileName}`

      const messageText = !firstValidFileProcessed ? text?.trim() || "" : ""
      firstValidFileProcessed = true

      const messageId = randomUUID()
      messageIds.push(messageId)

      messagesData.push({
        id: messageId,
        text: messageText,
        chatId,
        profileId: userProfile.id,
        replyToId: validReplyToId,
        attachments: [
          {
            url: fileUrl,
            type: fileType,
            name: file.name,
            size: file.size,
          },
        ] as unknown as Prisma.InputJsonValue,
      })
    }

    if (messagesData.length === 0) {
      return NextResponse.json({ error: "Нет валидных файлов" }, { status: 400 })
    }

    // ШАГ 2: Массовое создание в БД (ОДИН запрос вместо N)
    // + обновление updatedAt у чата в транзакции
    const [_, chatInfo] = await prisma.$transaction([
      prisma.message.createMany({
        data: messagesData,
      }),
      prisma.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
        select: { organizationId: true },
      }),
    ])

    const createdMessages = await prisma.message.findMany({
      where: {
        id: { in: messageIds },
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
    })

    const mappedMessages = createdMessages.map((message) => ({
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
    }))

    await triggerSocketEvent("srv:message:new", {
      messages: mappedMessages,
      organizationId: chatInfo?.organizationId || null,
    })

    return NextResponse.json({ messages: mappedMessages })
  } catch (error) {
    console.error("Ошибка загрузки:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
