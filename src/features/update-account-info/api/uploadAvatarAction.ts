"use server"

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { updateTag } from "next/cache" // ← Заменяем revalidateTag на updateTag
import { headers } from "next/headers"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/prisma/prisma-client"
import { getSession } from "@/shared/lib/server-current-user"
import { triggerSocketEvent } from "@/shared/lib/socket-trigger"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/opt/chat-app/uploads"
export const uploadAvatarAction = async (formData: FormData) => {
  const session = await getSession()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const file = formData.get("avatar") as File
  const id = formData.get("profileId") as string
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Некорректный файл изображения")
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Файл слишком большой (макс. 5MB)")
  }

  const uploadDir = path.join(UPLOAD_DIR, "media", "avatars", session.user.id)
  await mkdir(uploadDir, { recursive: true })

  const ext = file.name.split(".").pop() || "webp"
  const fileName = `${Date.now()}.${ext}`
  const filePath = path.join(uploadDir, fileName)

  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  const imageUrl = `/api/uploads/media/avatars/${session.user.id}/${fileName}`

  const requestHeaders = await headers()

  await auth.api.updateUser({
    body: { image: imageUrl },
    headers: requestHeaders,
  })

  await prisma.profile.update({
    where: { id },
    data: { imageUrl },
  })

  updateTag(`profile-${id}`)

  await triggerSocketEvent("srv:user:updated", {
    userId: session.user.id,
    profileId: (session.user as Record<string, unknown>).profileId as string,
    organizationId: (session.user as Record<string, unknown>).organizationId as string,
    image: imageUrl,
  })

  return { url: imageUrl }
}
