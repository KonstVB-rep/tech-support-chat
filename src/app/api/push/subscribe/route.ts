import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 });
    }

    const subscription = await request.json();

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        pushSubscription: subscription,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Ошибка сохранения push-подписки:", e);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
