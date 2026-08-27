"use server"

import { unlink } from "node:fs/promises"
import path from "node:path"
import { updateTag } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"
import { triggerSocketEvent } from "@/shared/lib/socket-trigger"
import type { ActionState } from "@/shared/lib/types"

export const deleteAccountFormAction = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const password = formData.get("password") as string

  try {
    await deleteAccountAction(password)
    return { success: true, message: "Аккаунт удален", error: null }
  } catch (error) {
    return {
      success: false,
      message: "Не удалось удалить аккаунт",
      error: error instanceof Error ? error.message : "Ошибка удаления аккаунта",
    }
  }
}

const deleteAccountAction = async (password: string): Promise<void> => {
  const requestHeaders = await headers()

  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user) throw new Error("Не авторизован")

  const userId = session.user.id
  const profileId = (session.user as Record<string, unknown>).profileId as string | undefined
  const organizationId = (session.user as Record<string, unknown>).organizationId as
    | string
    | undefined

  // Запоминаем оригинальные данные ДО анонимизации
  const currentProfile = profileId
    ? await prisma.profile.findUnique({
        where: { userId },
        select: { name: true, username: true, imageUrl: true },
      })
    : null

  const originalName = currentProfile?.name || session.user.name || "Без имени"
  const originalUsername = currentProfile?.username ?? null

  // Верификация пароля
  try {
    await auth.api.verifyPassword({
      body: { password },
      headers: requestHeaders,
    })
  } catch {
    throw new Error("Неверный пароль")
  }

  // Удаляем аватар с диска (User.image + Profile.imageUrl)
  const uploadDir = process.env.UPLOAD_DIR || "/opt/chat-app/uploads"

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { image: true },
  })

  if (user?.image && typeof user.image === "string" && user.image.startsWith("/uploads/")) {
    const relativePath = user.image.replace(/^\/uploads\//, "").replace(/\\/g, "/")
    const filePath = path.join(/* turbopackIgnore: true */ uploadDir, relativePath)
    try {
      await unlink(filePath)
    } catch {}
  }

  if (
    currentProfile?.imageUrl &&
    typeof currentProfile.imageUrl === "string" &&
    currentProfile.imageUrl.startsWith("/uploads/")
  ) {
    const relativePath = currentProfile.imageUrl.replace(/^\/uploads\//, "").replace(/\\/g, "/")
    const filePath = path.join(/* turbopackIgnore: true */ uploadDir, relativePath)
    try {
      await unlink(filePath)
    } catch {}
  }

  // Атомарная транзакция
  const timestamp = Math.floor(Date.now() / 1000)
  const suffix = `_deleted_${timestamp}`
  const fakeEmail = `deleted-${userId}-${timestamp}@removed.local`

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        email: fakeEmail,
        name: originalName,
        image: null,
      },
    }),
    ...(profileId
      ? [
          prisma.profile.update({
            where: { userId },
            data: {
              name: originalName,
              deactivationLabel: "Аккаунт удалён",
              email: fakeEmail,
              phone: null,
              username: originalUsername ? `${originalUsername}${suffix}` : null,
              imageUrl: null,
              deletedAt: new Date(),
            },
          }),
        ]
      : []),
  ])

  // Блокировка входа
  try {
    await auth.api.banUser({ body: { userId }, headers: requestHeaders })
  } catch (e) {
    console.error(`⚠️ Не удалось заблокировать аккаунт ${userId}:`, e)
  }

  // Инвалидация кэша
  if (profileId) updateTag(`profile-${profileId}`)
  if (organizationId) updateTag(`employees-${organizationId}`)
  updateTag("support-engineers")

  // Real-time
  await triggerSocketEvent("srv:user:updated", {
    userId,
    profileId: profileId ?? null,
    organizationId: organizationId ?? null,
    name: originalName,
    deactivationLabel: "Аккаунт удалён",
    image: null,
    isEngineer: false,
  })
}
