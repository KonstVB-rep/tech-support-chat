// src/app/api/chats/[id]/messages/media-upload/route.ts
import { auth } from "@/app/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/opt/chat-app/uploads";
const MEDIA_DIR = path.join(UPLOAD_DIR, "media");
const FILES_DIR = path.join(UPLOAD_DIR, "files");
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_FILES_PER_REQUEST = 10;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm"];
const MEDIA_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];

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

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const text = formData.get("text") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Файлы не найдены" }, { status: 400 });
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Максимум ${MAX_FILES_PER_REQUEST} файлов за раз` },
        { status: 400 },
      );
    }

    const chatInfo = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { organizationId: true },
    });

    const createdMessages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > MAX_FILE_SIZE) continue; // Пропускаем слишком большие

      const isMedia = MEDIA_TYPES.includes(file.type);
      const baseDir = isMedia ? MEDIA_DIR : FILES_DIR;
      const fileType = isMedia
        ? IMAGE_TYPES.includes(file.type)
          ? "image"
          : "video"
        : "file";

      const ext = file.name.split(".").pop() || "bin";
      const fileName = `${randomUUID()}.${ext}`;
      const targetDir = path.join(baseDir, "chats", chatId);

      await mkdir(targetDir, { recursive: true });

      const filePath = path.join(targetDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);

      const urlPrefix = isMedia ? "media" : "files";
      const fileUrl = `/uploads/${urlPrefix}/chats/${chatId}/${fileName}`;

      const messageText = i === 0 ? text?.trim() || "" : "";

      const message = await prisma.message.create({
        data: {
          text: messageText,
          chatId,
          profileId: userProfile.id,
          attachments: [
            {
              url: fileUrl,
              type: fileType,
              name: file.name,
              size: file.size,
            },
          ] as unknown as Prisma.InputJsonValue,
        },
        include: {
          profile: {
            select: { id: true, name: true, userId: true, imageUrl: true },
          },
        },
      });

      createdMessages.push(message);
    }

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    for (const message of createdMessages) {
      await triggerSocketEvent("srv:message:new", {
        message,
        organizationId: chatInfo?.organizationId || null,
      });
    }

    return NextResponse.json({ messages: createdMessages });
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
