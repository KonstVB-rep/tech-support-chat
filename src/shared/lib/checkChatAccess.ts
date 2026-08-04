// src/shared/lib/checkChatAccess.ts

import { prisma } from "@/prisma/prisma-client"

interface CheckAccessResult {
  allowed: boolean
  error?: string
  status?: number
}

export const checkChatAccess = async (
  chatId: string,
  session: { user: { role: string; id: string } },
  userProfileId: string,
  options: { checkContract: boolean } = { checkContract: true },
): Promise<CheckAccessResult> => {
  const isGlobalAdmin = session.user.role.toLowerCase() === "admin"
  if (isGlobalAdmin) return { allowed: true }

  const isSupportEngineer = await prisma.supportEngineer.findUnique({
    where: { profileId: userProfileId },
  })
  if (isSupportEngineer) return { allowed: true }

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { organization: true },
  })

  if (!chat) return { allowed: false, error: "Чат не найден", status: 404 }

  if (chat.organization && !chat.organization.isActive) {
    return {
      allowed: false,
      error: "Обслуживание организации временно приостановлено",
      status: 403,
    }
  }

  if (options.checkContract && chat.organization) {
    const now = new Date()

    if (now < chat.organization.contractStart || now > chat.organization.contractEnd) {
      return {
        allowed: false,
        error: "Договор не активен",
        status: 403,
      }
    }
  }

  if (chat.organizationId) {
    const orgMembership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_profileId: {
          organizationId: chat.organizationId,
          profileId: userProfileId,
        },
      },
      select: { role: true },
    })
    if (orgMembership && orgMembership.role === "RESPONSIBLE") {
      return { allowed: true }
    }
  }

  const isChatMember = await prisma.chatMember.findUnique({
    where: { chatId_profileId: { chatId, profileId: userProfileId } },
  })
  if (isChatMember) return { allowed: true }

  return {
    allowed: false,
    error: "Доступ к этому чату заблокирован. Вы не являетесь его участником.",
    status: 403,
  }
}
