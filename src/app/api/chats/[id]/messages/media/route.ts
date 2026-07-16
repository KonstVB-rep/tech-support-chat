import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: chatId } = await params;

    // 1. Авторизация
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

    // 2. Проверка доступа к чату
    const chatMember = await prisma.chatMember.findUnique({
      where: {
        chatId_profileId: { chatId, profileId: userProfile.id },
      },
    });

    const isGlobalAdmin = session.user.role.toLowerCase() === "admin";
    const isSupportEngineer = await prisma.supportEngineer.findUnique({
      where: { profileId: userProfile.id },
    });

    if (!chatMember && !isGlobalAdmin && !isSupportEngineer) {
      return NextResponse.json(
        { error: "Нет доступа к этому чату" },
        { status: 403 },
      );
    }

    // 3. Парсинг тела запроса
    const { fileUrl, fileType, fileName, fileSize, text } = await req.json();

    if (!fileUrl || !fileType) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные поля fileUrl или fileType" },
        { status: 400 },
      );
    }

    // 4. Создание сообщения в БД
    const message = await prisma.message.create({
      data: {
        text: text?.trim() || "",
        chatId,
        profileId: userProfile.id,
        fileUrl,
        fileType,
        fileName: fileName || null,
        fileSize: fileSize || null,
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

    // 5. Обновляем updatedAt чата (чтобы он поднялся в сайдбаре)
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // 6. Получаем organizationId для адресной доставки
    const chatInfo = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { organizationId: true },
    });

    // 7. ✅ Real-time доставка всем участникам чата
    await triggerSocketEvent("srv:message:new", {
      message,
      organizationId: chatInfo?.organizationId || null,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Ошибка сохранения медиа-сообщения:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при сохранении" },
      { status: 500 },
    );
  }
}