//api/chats/[id]/messages/media
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";
import { Prisma } from "@prisma/client";

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

    const { fileUrl, fileType, fileName, fileSize, text } = await req.json();

    if (!fileUrl || !fileType) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные поля fileUrl или fileType" },
        { status: 400 },
      );
    }

    const message = await prisma.message.create({
      data: {
        text: text?.trim() || "",
        chatId,
        profileId: userProfile.id,
        attachments: [
          {
            url: fileUrl,
            type: fileType,
            name: fileName,
            size: fileSize,
          },
        ] as unknown as Prisma.InputJsonValue,
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

    const chatInfo = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { organizationId: true },
    });

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
