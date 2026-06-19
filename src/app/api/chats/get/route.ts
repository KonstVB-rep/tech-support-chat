import { auth } from "@/app/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  try {
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

    const isSupport = user.role === "support";

    const chats = await prisma.chat.findMany({
      where: isSupport ? undefined : { creatorId: user.profile.id },
      orderBy: { updatedAt: "desc" },
      include: {
        creator: { select: { id: true, name: true, imageUrl: true } },
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json({ chats });
  } catch (error: any) {
    console.error("Ошибка загрузки чатов:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка сервера" },
      { status: 500 },
    );
  }
}
