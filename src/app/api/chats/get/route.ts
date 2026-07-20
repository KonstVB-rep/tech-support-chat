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
      chats = await prisma.chat.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          creator: { select: { id: true, name: true, imageUrl: true } },
          organization: { select: { id: true, name: true } },
          _count: { select: { messages: true } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              text: true,
              fileUrl: true,
              fileType: true,
              createdAt: true,
              profile: {
                select: {
                  name: true,
                  userId: true,
                },
              },
            },
          },
          members: {
            where: { profileId: userProfile.id },
            select: { lastReadAt: true },
          },
        },
      });
    } else {
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
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              text: true,
              fileUrl: true,
              fileType: true,
              createdAt: true,
              profile: {
                select: {
                  name: true,
                  userId: true,
                },
              },
            },
          },
          members: {
            where: { profileId: userProfile.id },
            select: { lastReadAt: true },
          },
        },
      });
    }

    const chatsWithUnread = chats.map((chat) => {
      const member = chat.members?.[0];
      const lastReadAt = member?.lastReadAt;

      const lastMessage = chat.messages?.[0] || null;

      const hasUnread = lastReadAt
        ? new Date(chat.updatedAt) > new Date(lastReadAt)
        : chat._count.messages > 0;

      return {
        ...chat,
        lastMessage, // Переименовываем в lastMessage для клиента
        messages: undefined,
        members: undefined,
        unreadCount: hasUnread ? chat._count.messages : 0,
      };
    });

    return NextResponse.json({ chats: chatsWithUnread });
  } catch (error) {
    console.error("Ошибка загрузки чатов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
