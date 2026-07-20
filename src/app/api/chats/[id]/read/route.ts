// src/app/api/chats/[id]/read/route.ts
import { auth } from "@/app/lib/auth";
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  await prisma.chatMember.upsert({
    where: {
      chatId_profileId: { chatId, profileId: userProfile.id },
    },
    update: { lastReadAt: new Date() },
    create: {
      chatId,
      profileId: userProfile.id,
      lastReadAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
