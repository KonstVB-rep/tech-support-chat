// src/entities/user/api/removeAvatarAction.ts
"use server"

import { readdir, unlink } from "node:fs/promises"
import path from "node:path"
import { updateTag } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"
import { triggerSocketEvent } from "@/shared/lib/socket-trigger"

export const removeAvatarAction = async (profileId: string): Promise<{ success: true }> => {
  const requestHeaders = await headers()

  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user) throw new Error("Unauthorized")

  const _user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  })

  const avatarDir = path.join(
    process.env.UPLOAD_DIR || "/opt/chat-app/uploads",
    "media",
    "avatars",
    session.user.id,
  )
  try {
    const files = await readdir(avatarDir)
    for (const file of files) {
      await unlink(path.join(avatarDir, file))
    }
  } catch {}

  // Очищаем поле image в БД
  await auth.api.updateUser({
    body: { image: null },
    headers: requestHeaders,
  })

  await prisma.profile.update({
    where: { id: profileId },
    data: { imageUrl: null },
  })

  updateTag(`profile-${profileId}`)

  const [isStaffMember, membership] = await Promise.all([
    prisma.staffMember.findUnique({ where: { profileId } }),
    prisma.organizationMember.findFirst({
      where: { profileId },
      select: { organizationId: true },
    }),
  ])

  if (isStaffMember) updateTag("staff")
  if (membership) updateTag(`employees-${membership.organizationId}`)

  await triggerSocketEvent("srv:user:updated", {
    userId: session.user.id,
    profileId,
    organizationId: membership?.organizationId ?? null,
    image: null,
    isStaffMember: !!isStaffMember,
  })

  return { success: true }
}
