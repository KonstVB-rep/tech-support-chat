// src/app/api/chats/get/route.ts
import { auth } from "@/app/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        organizationMembers: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 });
    }

    const isSupportEngineer = await prisma.supportEngineer.findUnique({
      where: { profileId: userProfile.id },
    });
    const isGlobalAdmin = session.user.role.toLowerCase() === "admin";

    let chats = [];

    if (isGlobalAdmin || isSupportEngineer) {
      // Суперадмин и вся техподдержка видят вообще ВСЕ существующие групповые чаты в системе!
      chats = await prisma.chat.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          creator: { select: { id: true, name: true, imageUrl: true } },
          organization: { select: { id: true, name: true } },
          _count: { select: { messages: true } },
        },
      });
    } else {
      // 🚀 ШАГ 2: Логика для КЛИЕНТОВ.
      // Собираем ID всех организаций, где этот юзер является легальным RESPONSIBLE (директором)
      const managedOrgIds = userProfile.organizationMembers
        .filter((m) => m.role === "RESPONSIBLE")
        .map((m) => m.organizationId);

      chats = await prisma.chat.findMany({
        where: {
          OR: [
            { organizationId: { in: managedOrgIds } },
            {
              members: {
                some: { profileId: userProfile.id },
              },
            },
          ],
        },
        orderBy: { updatedAt: "desc" },
        include: {
          creator: { select: { id: true, name: true, imageUrl: true } },
          organization: { select: { id: true, name: true } },
          _count: { select: { messages: true } },
        },
      });
    }

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Ошибка загрузки чатов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
