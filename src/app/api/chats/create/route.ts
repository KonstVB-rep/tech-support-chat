// src/app/api/chats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { auth } from "@/app/lib/auth";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";

export const POST = async (request: Request) => {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user || session.user.role.toLowerCase() !== "admin") {
      return NextResponse.json(
        {
          error:
            "Доступ запрещен. Только администратор системы может создавать новые темы.",
        },
        { status: 403 },
      );
    }

    const { title, organizationId } = await request.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Название темы обязательно" },
        { status: 400 },
      );
    }

    if (!organizationId) {
      return NextResponse.json(
        { error: "Не указан идентификатор организации клиента" },
        { status: 400 },
      );
    }

    const adminProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!adminProfile) {
      return NextResponse.json(
        { error: "Профиль администратора не найден" },
        { status: 404 },
      );
    }

    const newTopic = await prisma.chat.create({
      data: {
        title: title.trim(),
        type: "GROUP", // Нативный Prisma энум ChatType
        creatorId: adminProfile.id,
        organizationId,
      },
    });

    // Находим профили всех АКТИВНЫХ инженеров техподдержки платформы Beget
    const activeEngineers = await prisma.supportEngineer.findMany({
      where: {
        profile: {
          user: {
            isActive: true, // Исключаем уволенных инженеров софт-блока
          },
        },
      },
      select: { profileId: true },
    });

    // Находим профили всех сотрудников компании-клиента, для которой создается тикет
    // Рядовые сотрудники (MEMBER) сюда НЕ попадут и чат при создании НЕ увидят.
    const clientMembers = await prisma.organizationMember.findMany({
      where: {
        organizationId: organizationId,
        role: "RESPONSIBLE",
      },
      select: { profileId: true },
    });

    // Собираем все ID профилей саппортов
    const engineerProfileIds = activeEngineers.map((eng) => eng.profileId);

    // Собираем все ID профилей сотрудников завода
    const clientProfileIds = clientMembers.map((m) => m.profileId);

    // Объединяем всех участников в один чистый массив уникальных ID (включая тебя, админа)
    const allUniqueProfileIds = Array.from(
      new Set([adminProfile.id, ...engineerProfileIds, ...clientProfileIds]),
    );

    // 🎯 Шаг 5: Формируем записи для таблицы-моста ChatMember строго по твоим энумам ChatRole
    const allMembersRecords = allUniqueProfileIds.map((profileId) => {
      // Логика элементарна: ты и инженеры саппорта — ADMIN. Клиенты завода — MEMBER.
      const isStaff =
        profileId === adminProfile.id || engineerProfileIds.includes(profileId);

      return {
        chatId: newTopic.id,
        profileId: profileId,
        role: isStaff ? ("ADMIN" as const) : ("MEMBER" as const),
      };
    });

    // Записываем пакет участников в MySQL Beget одним монолитным запросом
    await prisma.chatMember.createMany({
      data: allMembersRecords,
    });

    triggerSocketEvent("srv:chat:new", {
      chat: {
        ...newTopic,
        // Прокидываем пустые или дефолтные счетчики, чтобы у фронтенда useGetChats не было undefined
        _count: { messages: 0 },
        organization: { id: organizationId, name: "Компания" },
      },
      organizationId,
    });

    return NextResponse.json(newTopic);
  } catch (error) {
    console.error("Ошибка при создании темы техподдержки:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
};
