// src/app/api/chats/[id]/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";

// Служебная функция валидации доступа к чату (без any в типах)
async function checkChatAccess(
  chatId: string,
  session: { user: { role: string; id: string } },
  userProfileId: string,
) {
  const isGlobalAdmin = session.user.role.toLowerCase() === "admin";
  if (isGlobalAdmin) return { allowed: true };

  // 1. Проверяем, является ли пользователь инженером поддержки (им можно всё)
  const isSupportEngineer = await prisma.supportEngineer.findUnique({
    where: { profileId: userProfileId },
  });
  if (isSupportEngineer) return { allowed: true };

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { organizationId: true },
  });

  if (!chat) return { allowed: false, error: "Чат не найден", status: 404 };

  // 3. Если чат привязан к компании, проверяем, является ли юзер RESPONSIBLE менеджером этой компании
  if (chat.organizationId) {
    const orgMembership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_profileId: {
          organizationId: chat.organizationId,
          profileId: userProfileId,
        },
      },
      select: { role: true },
    });

    // Руководители компании имеют сквозной легальный доступ ко всем тикетам своего завода!
    if (orgMembership && orgMembership.role === "RESPONSIBLE") {
      return { allowed: true };
    }
  }

  // 4. Для всех остальных (рядовых MEMBER) — проверяем строгое физическое присутствие в чате
  const isChatMember = await prisma.chatMember.findUnique({
    where: {
      chatId_profileId: { chatId, profileId: userProfileId },
    },
  });

  if (isChatMember) return { allowed: true };

  return {
    allowed: false,
    error: "Доступ к этому чату заблокирован. Вы не являетесь его участником.",
    status: 403,
  };
}

// GET - загрузка истории сообщений + данных чата для шапки окна переписки
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: chatId } = await params;

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 });
    }

    // Проверяем права доступа
    const access = await checkChatAccess(chatId, session, userProfile.id);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status ?? 403 },
      );
    }

    // 1. Качаем сообщения из базы Beget
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

    // 🚀 2. ДОБАВЛЕНО: Докачиваем актуальную информацию о самом чате и его организации для шапки UI!
    const chatInfo = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        id: true,
        title: true,
        organizationId: true,
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    // 🎯 Возвращаем монолитный JSON: и сообщения, и мета-данные чата
    return NextResponse.json({
      messages: messages || [],
      chat: chatInfo,
    });
  } catch (error) {
    console.error("Ошибка загрузки messages:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при чтении истории" },
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

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 });
    }

    // Проверяем права доступа перед записью сообщения
    const access = await checkChatAccess(chatId, session, userProfile.id);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status ?? 403 },
      );
    }

    const { text } = await req.json();
    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Сообщение пустое" }, { status: 400 });
    }

    const chatInfo = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { organizationId: true },
    });

    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        chatId,
        profileId: userProfile.id,
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

    await triggerSocketEvent("srv:message:new", {
      message,
      organizationId: chatInfo?.organizationId || null,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при отправке" },
      { status: 500 },
    );
  }
}
