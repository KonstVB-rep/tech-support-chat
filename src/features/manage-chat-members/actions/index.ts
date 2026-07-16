// src/features/manage-chat-members/actions/index.ts
"use server";

import { prisma } from "@/prisma/prisma-client";
import { getSession } from "@/shared/lib/server-current-user";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";
import { OrgRole } from "@prisma/client";

interface ChatMemberPayload {
  chatId: string;
  targetProfileId: string;
}

interface UpdateTitlePayload {
  chatId: string;
  newTitle: string;
}

interface GetMembersPayload {
  chatId: string;
}
/**
 * 🔒 СЛУЖЕБНЫЙ ХЕЛПЕР: Проверяет, имеет ли право текущий юзер управлять участниками этого чата.
 * Защищает от межорганизационного взлома (Cross-Tenant Leak).
 */
async function checkManagePermission(
  chatId: string,
  sessionUserId: string,
  sessionUserRole: string,
) {
  const isGlobalAdmin = sessionUserRole.toLowerCase() === "admin";

  // Если это глобальный админ системы (ты) — у него полный карт-бланш
  if (isGlobalAdmin) {
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    return { allowed: true, chat };
  }

  // 1. Ищем чат, чтобы узнать, к какой организации он привязан
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { id: true, organizationId: true, creatorId: true },
  });

  if (!chat || !chat.organizationId) {
    return {
      allowed: false,
      error: "Чат не найден или не привязан к организации",
    };
  }

  // 2. Ищем профиль залогиненного пользователя
  const requesterProfile = await prisma.profile.findUnique({
    where: { userId: sessionUserId },
    select: { id: true },
  });

  if (!requesterProfile) {
    return { allowed: false, error: "Ваш профиль не найден" };
  }

  // 3. ПРОВЕРКА ДЛЯ RESPONSIBLE: проверяем, является ли юзер менеджером ИМЕННО ЭТОЙ организации
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_profileId: {
        organizationId: chat.organizationId,
        profileId: requesterProfile.id,
      },
    },
    select: { role: true },
  });

  // Доступ разрешен только в том случае, если роль строго RESPONSIBLE в этой конкретной компании
  if (!membership || membership.role !== OrgRole.RESPONSIBLE) {
    return {
      allowed: false,
      error:
        "У вас нет прав менеджера для управления участниками чата этой организации",
    };
  }

  return { allowed: true, chat };
}

/**
 * 🚀 ФУНКЦИЯ №1: ДОБАВЛЕНИЕ СОТРУДНИКА В ЧАТ (В РЕАЛЬНОМ ВРЕМЕНИ)
 */
export const addChatMemberAction = async ({
  chatId,
  targetProfileId,
}: ChatMemberPayload) => {
  try {
    const session = await getSession();
    if (!session?.user) return { success: false, error: "Не авторизован" };

    // Проверяем права админа или локального RESPONSIBLE
    const check = await checkManagePermission(
      chatId,
      session.user.id,
      session.user.role,
    );
    if (!check.allowed || !check.chat)
      return { success: false, error: check.error };

    const organizationId = check.chat.organizationId;

    // Проверяем, состоит ли добавляемый сотрудник ИМЕННО на этом заводе!
    // Если менеджер рулит двумя фирмами, он не сможет перетащить рабочего из фирмы А в фирму Б!
    if (organizationId) {
      const targetInOrg = await prisma.organizationMember.findUnique({
        where: {
          organizationId_profileId: {
            organizationId, // ID завода текущего чата
            profileId: targetProfileId, // ID профиля добавляемого человека
          },
        },
      });

      if (!targetInOrg) {
        return {
          success: false,
          error:
            "Критическая ошибка безопасности: Этот сотрудник не работает в организации, к которой принадлежит данный чат!",
        };
      }
    }

    await prisma.chatMember.upsert({
      where: {
        chatId_profileId: { chatId, profileId: targetProfileId },
      },
      create: {
        chatId,
        profileId: targetProfileId,
        role: "MEMBER", // Добавленные руками заходят как обычные участники
      },
      update: {}, // Если уже внутри — игнорируем
    });

    // Вытягиваем полный объект чата с релейшенами для сокет-триггера
    const fullChatData = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        creator: { select: { id: true, name: true, imageUrl: true } },
        organization: { select: { id: true, name: true } },
        _count: { select: { messages: true } },
      },
    });

    // 🔥 РЕАЛЬНОЕ ВРЕМЯ: Стреляем в сокет-сервер на порту 4000.
    // Направляем чат строго в личную комнату user:id добавленного сотрудника
    if (fullChatData) {
      await triggerSocketEvent("srv:member:added", {
        chat: fullChatData,
        targetProfileId,
      });
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Ошибка addChatMemberAction:", error);
    return { success: false, error: "Ошибка сервера при добавлении в чат" };
  }
};

/**
 * 🚀 ФУНКЦИЯ №2: УДАЛЕНИЕ СОТРУДНИКА ИЗ ЧАТА (В РЕАЛЬНОМ ВРЕМЕНИ)
 */
export const removeChatMemberAction = async ({
  chatId,
  targetProfileId,
}: ChatMemberPayload) => {
  try {
    const session = await getSession();
    if (!session?.user) return { success: false, error: "Не авторизован" };

    // Проверяем права админа или локального RESPONSIBLE
    const check = await checkManagePermission(
      chatId,
      session.user.id,
      session.user.role,
    );
    if (!check.allowed || !check.chat)
      return { success: false, error: check.error };

    // 🔒 ЗАЩИТА ОТ САМОУДАЛЕНИЯ: Нельзя удалить создателя чата, чтобы ветка не осталась бесхозной
    if (check.chat.creatorId === targetProfileId) {
      return {
        success: false,
        error: "Запрещено удалять создателя темы из обсуждения",
      };
    }

    // Удаляем связь из таблицы-моста ChatMember в MySQL Beget
    await prisma.chatMember.delete({
      where: {
        chatId_profileId: {
          chatId,
          profileId: targetProfileId,
        },
      },
    });

    // 🔥 РЕАЛЬНОЕ ВРЕМЯ: Выбиваем чат с экрана уволенного сотрудника!
    // Отправляем команду srv:member:removed в его личную сокет-комнату user:id
    await triggerSocketEvent("srv:member:removed", {
      chatId,
      targetProfileId,
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Ошибка removeChatMemberAction:", error);
    return { success: false, error: "Ошибка сервера при удалении участника" };
  }
};

interface UpdateTitlePayload {
  chatId: string;
  newTitle: string;
}

/**
 * 🚀 ФУНКЦИЯ №3: ОБНОВЛЕНИЕ НАЗВАНИЯ ЧАТА (В РЕАЛЬНОМ ВРЕМЕНИ)
 * 🔒 СТРОГИЙ РЕГЛАМЕНТ: Доступно исключительно суперадминистратору системы.
 */
export const updateChatTitleAction = async ({
  chatId,
  newTitle,
}: UpdateTitlePayload) => {
  try {
    const session = await getSession();

    // 🔒 ЖЕСТКИЙ БАРЬЕР: Если не админ — сразу жесткий от ворот поворот
    if (!session?.user || session.user.role.toLowerCase() !== "admin") {
      return {
        success: false,
        error:
          "Доступ запрещен. Менять названия тем может только главный администратор.",
      };
    }

    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      return { success: false, error: "Название темы не может быть пустым" };
    }

    // 1. Ищем чат в MySQL Beget, чтобы вытащить ID организации для сокетов
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { organizationId: true },
    });

    if (!chat) {
      return {
        success: false,
        error: "Редактируемый чат не найден в базе данных",
      };
    }

    // 2. Обновляем название чата в базе данных
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        title: trimmedTitle,
        updatedAt: new Date(), // Обновляем таймштамп активности, чтобы чат поднялся наверх
      },
    });

    // 3. 🔥 РЕАЛЬНОЕ ВРЕМЯ: Если чат привязан к компании, пинаем сокет-сервер 4000
    if (chat.organizationId) {
      await triggerSocketEvent("srv:chat:rename", {
        chatId,
        newTitle: trimmedTitle,
        organizationId: chat.organizationId,
      });
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Ошибка в updateChatTitleAction:", error);
    return {
      success: false,
      error: "Критическая ошибка сервера при переименовании темы",
    };
  }
};

export interface EmployeeInChat {
  profileId: string;
  name: string;
  isInChat: boolean;
}

interface ActionResponse<T = null> {
  success: boolean;
  data: T;
  error: string | null;
}

export const getChatMembersAction = async ({
  chatId,
}: GetMembersPayload): Promise<ActionResponse<EmployeeInChat[]>> => {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { success: false, data: [], error: "Не авторизован" };
    }

    // 1. Быстро узнаем profileId текущего пользователя
    const currentUserProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { organizationId: true },
    });

    if (!chat || !chat.organizationId) {
      return {
        success: false,
        data: [],
        error: "Чат или привязанная организация не найдены",
      };
    }
    const orgMembers = await prisma.organizationMember.findMany({
      where: {
        organizationId: chat.organizationId,
        ...(currentUserProfile?.id && {
          profileId: {
            not: currentUserProfile.id,
          },
        }),
      },
      include: {
        profile: {
          select: { id: true, name: true },
        },
      },
    });

    // 3. Качаем список тех, кто уже сидит в чате
    const activeChatMembers = await prisma.chatMember.findMany({
      where: { chatId },
      select: { profileId: true },
    });

    const activeProfileIds = new Set(activeChatMembers.map((m) => m.profileId));

    // 4. Теперь метод .map() становится максимально простым, чистым и без лишних if-проверок!
    const employeesList: EmployeeInChat[] = orgMembers
      .map((member) => {
        if (!member.profile) return null;
        return {
          profileId: member.profile.id,
          name: member.profile.name,
          isInChat: activeProfileIds.has(member.profile.id),
        };
      })
      .filter((emp): emp is EmployeeInChat => emp !== null);

    return { success: true, data: employeesList, error: null };
  } catch (error) {
    console.error("Ошибка getChatMembersAction:", error);
    return {
      success: false,
      data: [],
      error: "Ошибка бэкенда при чтении штата организации",
    };
  }
};

interface DeleteChatPayload {
  chatId: string;
}

export const deleteChatAction = async ({
  chatId,
}: DeleteChatPayload): Promise<ActionResponse> => {
  try {
    const session = await getSession();

    // 🔒 ЖЕСТКИЙ БАРЬЕР: Менеджеры завода или инженеры саппорта не имеют права тереть историю.
    // ЕслиRPC-вызов сделает не админ — сразу выкидываем ошибку безопасности.
    if (!session?.user || session.user.role.toLowerCase() !== "admin") {
      return {
        success: false,
        data: null,
        error:
          "Доступ запрещен. Удалять темы обсуждений может только администратор.",
      };
    }

    // 1. Ищем чат в MySQL Beget, чтобы узнать, к какому заводу он был привязан (нужно для сокет-комнат)
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: { organizationId: true },
    });

    if (!chat) {
      return {
        success: false,
        data: null,
        error: "Удаляемая тема обращения не найдена в базе данных",
      };
    }

    // 2. Сносим чат из базы данных.
    // Из-за onDelete: Cascade в твоей схеме Prisma, все записи участников ChatMember
    // и все сообщения Message по этому chatId сотрутся автоматически одной транзакцией!
    await prisma.chat.delete({
      where: { id: chatId },
    });

    // 3. 🔥 РЕАЛЬНОЕ ВРЕМЯ: Стираем чат с экранов ВСЕХ сотрудников этого завода и саппорта!
    if (chat.organizationId) {
      // Пингуем наш системный сокет-канал. server.js на порту 4000 примет команду "srv:chat:deleted"
      // и мгновенно разошлет "chat:removed" по нужным PWA-клиентам в реальном времени!
      triggerSocketEvent("srv:chat:deleted", {
        chatId,
        organizationId: chat.organizationId,
      });
    }

    return { success: true, data: null, error: null };
  } catch (error) {
    console.error("Критическая ошибка в deleteChatAction:", error);
    return {
      success: false,
      data: null,
      error: "Критическая ошибка сервера при удалении темы обсуждения",
    };
  }
};
