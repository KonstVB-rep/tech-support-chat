// src/app/api/chats/[id]/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

// GET - загрузка истории сообщений
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: chatId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
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
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error("Ошибка загрузки сообщений:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка сервера" },
      { status: 500 },
    );
  }
}

// POST - отправка сообщения
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: chatId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!user?.profile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 });
    }

    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Сообщение пустое" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        chatId,
        profileId: user.profile.id,
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
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // Отправляем через Socket.IO
    if (global.io) {
      global.io.to(`chat:${chatId}`).emit("message:new", message);
      global.io.emit("chat:updated", { chatId });
    }

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error("Ошибка отправки сообщения:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка сервера" },
      { status: 500 },
    );
  }
}
