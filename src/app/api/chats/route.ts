import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { auth } from "@/app/lib/auth";

export const POST = async (request: Request) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    if (session.user.role === "user" && !session.user.canCreateGroups) {
      return NextResponse.json(
        { error: "Администратор ограничил вам право на создание новых тем" },
        { status: 403 },
      );
    }

    const { title } = await request.json();
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Название темы обязательно" },
        { status: 400 },
      );
    }

    const creatorProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!creatorProfile) {
      return NextResponse.json({ error: "Профиль не найден" }, { status: 404 });
    }

    // 1. Создаем чистый чат темы БЕЗ вложенного members.create (чтобы избежать конфликтов MySQL)
    const newTopic = await prisma.chat.create({
      data: {
        title: title.trim(),
        type: "GROUP",
        creatorId: creatorProfile.id,
      },
    });

    // 2. Ищем команду техподдержки
    const staffUsers = await prisma.user.findMany({
      where: {
        OR: [{ role: "support" }, { role: "admin" }],
      },
      select: {
        profile: { select: { id: true } },
      },
    });

    const staffProfileIds = staffUsers
      .map((u) => u.profile?.id)
      .filter((id): id is string => !!id && id !== creatorProfile.id);

    // 3. 🎯 СОБИРАЕМ ВСЕХ В ОДИН МАССИВ: Себя как OWNER + Саппортов как ADMIN
    const allMembersRecords = [
      {
        chatId: newTopic.id,
        profileId: creatorProfile.id,
        role: "OWNER" as const,
      },
      ...staffProfileIds.map((profileId) => ({
        chatId: newTopic.id,
        profileId: profileId,
        role: "ADMIN" as const,
      })),
    ];

    // 4. Записываем весь список участников в MySQL Beget одним монолитным запросом
    await prisma.chatMember.createMany({
      data: allMembersRecords,
    });

    return NextResponse.json(newTopic);
  } catch (error) {
    console.error("Ошибка при создании темы техподдержки:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
};
