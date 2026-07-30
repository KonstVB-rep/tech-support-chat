// src/features/manage-organization/actions/delete.ts
"use server"
import { updateTag } from "next/cache"
import { prisma } from "@/prisma/prisma-client"
import { USER_ROLE } from "@/shared/constants"
import { getSession } from "@/shared/lib/server-current-user"
import type { DeleteActionState } from "@/shared/lib/types"

export const deleteOrganizationAction = async (
  ids: string[] | string,
): Promise<DeleteActionState> => {
  try {
    const session = await getSession()
    if (!session?.user) return { success: false, deletedCount: 0, error: "Не авторизован" }
    if (session.user.role !== USER_ROLE.ADMIN)
      return { success: false, deletedCount: 0, error: "Доступ запрещен" }

    const idsArray = Array.isArray(ids) ? ids : [ids]
    const validIds = idsArray.filter((id) => id && id.trim() !== "")

    if (!validIds.length)
      return {
        success: false,
        deletedCount: 0,
        error: "Не переданы валидные ID",
      }

    // 1. 🔍 ИЩЕМ ВСЕХ УЧАСТНИКОВ УДАЛЯЕМЫХ ОРГАНИЗАЦИЙ
    const members = await prisma.organizationMember.findMany({
      where: { organizationId: { in: validIds } },
      select: {
        profileId: true,
        profile: { select: { userId: true } },
      },
    })

    const affectedProfileIds = members.map((m) => m.profileId)

    // 2. ВЫЯВЛЯЕМ "СИРОТ": Ищем профили, которые привязаны ТОЛЬКО к удаляемым компаниям
    const totalMemberships = await prisma.organizationMember.findMany({
      where: { profileId: { in: affectedProfileIds } },
      select: { profileId: true, organizationId: true },
    })

    // Фильтруем: оставляем только те профили, у которых нет других живых организаций
    const profileIdsToDestroy: string[] = []
    const userIdsToDestroy: string[] = []

    members.forEach((m) => {
      const otherCompanies = totalMemberships.filter(
        (tm) => tm.profileId === m.profileId && !validIds.includes(tm.organizationId),
      )

      // 🎯 ЕСЛИ ДРУГИХ КОМПАНИЙ НЕТ — этого юзера можно полностью и безопасно стереть!
      if (otherCompanies.length === 0) {
        profileIdsToDestroy.push(m.profileId)
        if (m.profile?.userId) userIdsToDestroy.push(m.profile.userId)
      }
    })

    // 🚀 3. АТОМАРНАЯ ТРАНЗАКЦИЯ КАСКАДНОЙ ЗАЧИСТКИ
    await prisma.$transaction([
      // Сносим сообщения и чаты только тех людей, которые удаляются насовсем
      prisma.message.deleteMany({
        where: { profileId: { in: profileIdsToDestroy } },
      }),

      prisma.chatMember.deleteMany({
        where: { profileId: { in: affectedProfileIds } }, // Из комнат выкидываем всех участников удаляемой фирмы
      }),

      prisma.chat.deleteMany({
        where: { organizationId: { in: validIds } }, // Намертво сносим чаты, привязанные к этой компании
      }),

      // Удаляем связи членства в удаляемых компаниях
      prisma.organizationMember.deleteMany({
        where: { organizationId: { in: validIds } },
      }),

      // Сносим профили и юзеров только тех, у кого больше нет других организаций в системе!
      prisma.profile.deleteMany({
        where: { id: { in: profileIdsToDestroy } },
      }),

      prisma.user.deleteMany({
        where: { id: { in: userIdsToDestroy } },
      }),

      // В самом конце со спокойной душой стираем саму Организацию
      prisma.organization.deleteMany({
        where: { id: { in: validIds } },
      }),
    ])

    validIds.forEach((id) => {
      updateTag(`organization-${id}`)
    })
    updateTag("organizations")

    return { success: true, deletedCount: validIds.length, error: null }
  } catch (error) {
    console.error("Критическая ошибка при полном удалении организации:", error)
    return {
      success: false,
      deletedCount: 0,
      error: "Не удалось удалить организации",
    }
  }
}
