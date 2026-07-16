import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/opt/chat-app/uploads";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 МБ

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
    const isMember = await prisma.chatMember.findUnique({
      where: { chatId_profileId: { chatId, profileId: userProfile.id } },
    });
    const isAdmin = session.user.role.toLowerCase() === "admin";
    const isSupport = await prisma.supportEngineer.findUnique({
      where: { profileId: userProfile.id },
    });

    if (!isMember && !isAdmin && !isSupport) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    // 3. Парсинг FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `Файл слишком большой (макс. ${MAX_FILE_SIZE / 1024 / 1024} МБ)`,
        },
        { status: 400 },
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Неподдерживаемый формат" },
        { status: 400 },
      );
    }

    // 4. Сохранение на диск
    const ext = file.name.split(".").pop() || "bin";
    const fileName = `${randomUUID()}.${ext}`;
    const chatDir = path.join(UPLOAD_DIR, "chats", chatId);

    await mkdir(chatDir, { recursive: true });

    const filePath = path.join(chatDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Публичный URL (Nginx будет отдавать по этому пути)
    const fileUrl = `/uploads/chats/${chatId}/${fileName}`;
    const fileType = file.type.startsWith("image/") ? "image" : "video";

    // 5. Запись в БД
    const message = await prisma.message.create({
      data: {
        text: text?.trim() || "",
        chatId,
        profileId: userProfile.id,
        fileUrl,
        fileType,
        fileName: file.name,
        fileSize: file.size,
      },
      include: {
        profile: {
          select: { id: true, name: true, userId: true, imageUrl: true },
        },
      },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // 6. Real-time
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
    console.error("Ошибка загрузки медиа:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
