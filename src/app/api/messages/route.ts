import type { Server as NetServer } from "node:http"
import type { Socket as NetSocket } from "node:net"
import { NextResponse } from "next/server"
import { Server as SocketIOServer } from "socket.io"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"

// Описываем строгий интерфейс для расширенного ответа сервера Next.js сокетами
interface SocketWithServer extends NetSocket {
  server: NetServer & {
    io?: SocketIOServer
  }
}

interface ResponseWithSocket {
  socket: SocketWithServer
}

declare global {
  var io: SocketIOServer | undefined
}

// Handler для инициализации сокетов с четким типом вместо any
const initSocket = (res: ResponseWithSocket) => {
  if (global.io) return

  const httpServer = res.socket?.server
  if (!httpServer) return

  const io = new SocketIOServer(httpServer, {
    path: "/api/messages/socket",
    addTrailingSlash: false,
    cors: { origin: "*" },
  })

  io.on("connection", (socket) => {
    socket.on("join_chat", (chatId: string) => {
      socket.join(chatId)
      console.log(`[Socket] Пользователь зашел в чат: ${chatId}`)
    })

    socket.on("leave_chat", (chatId: string) => {
      socket.leave(chatId)
      console.log(`[Socket] Пользователь вышел из чата: ${chatId}`)
    })
  })

  global.io = io
  console.log("🚀 Server Socket.io успешно запущен на localhost")
}

// =========================================================================
// 1. GET: История сообщений чата объекта
// =========================================================================
export const GET = async (request: Request) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 })

    const socketContext = {
      socket: global.htmlServerResponse?.socket,
    } as unknown as ResponseWithSocket
    initSocket(socketContext)

    const { searchParams } = new URL(request.url)
    const chatId = searchParams.get("chatId")
    if (!chatId) return NextResponse.json({ error: "chatId отсутствует" }, { status: 400 })

    const messages = await prisma.message.findMany({
      where: { chatId },
      include: {
        profile: {
          select: {
            name: true,
            imageUrl: true,
            userId: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Ошибка GET messages:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

// =========================================================================
// 2. POST: Отправка сообщения + Мгновенный пуш в сокеты
// =========================================================================
export const POST = async (request: Request) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: "Не авторизован" }, { status: 401 })

    const { chatId, text } = await request.json()
    if (!chatId || !text.trim())
      return NextResponse.json({ error: "Невалидные данные" }, { status: 400 })

    const senderProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })
    if (!senderProfile) return NextResponse.json({ error: "Профиль не найден" }, { status: 404 })

    const newMessage = await prisma.message.create({
      data: {
        chatId,
        text: text.trim(),
        profileId: senderProfile.id,
      },
      include: {
        profile: { select: { name: true, imageUrl: true } },
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

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    })

    if (global.io) {
      global.io.to(chatId).emit("new_message", newMessage)
      console.log(`[Socket] Сообщение улетело в комнату: ${chatId}`)
    }

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error("Ошибка POST messages:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
