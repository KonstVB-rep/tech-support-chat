// src/entities/user/api/removeAvatarAction.ts
"use server";

import { unlink } from "fs/promises";
import path from "path";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { updateTag } from "next/cache";
import { triggerSocketEvent } from "@/shared/lib/socket-trigger";
import { prisma } from "@/prisma/prisma-client";

export const removeAvatarAction = async (
  profileId: string,
): Promise<{ success: true }> => {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({ headers: requestHeaders });
  if (!session?.user) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  });

  if (user?.image && user.image.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", user.image);
    try {
      await unlink(filePath);
    } catch {}
  }

  // Очищаем поле image в БД
  await auth.api.updateUser({
    body: { image: null },
    headers: requestHeaders,
  });

  updateTag(`profile-${profileId}`);

  const [isEngineer, membership] = await Promise.all([
    prisma.supportEngineer.findUnique({ where: { profileId } }),
    prisma.organizationMember.findFirst({
      where: { profileId },
      select: { organizationId: true },
    }),
  ]);

  if (isEngineer) updateTag("support-engineers");
  if (membership) updateTag(`employees-${membership.organizationId}`);

  await triggerSocketEvent("srv:user:updated", {
    userId: session.user.id,
    profileId,
    organizationId: membership?.organizationId ?? null,
    image: null,
    isEngineer: !!isEngineer,
  });

  return { success: true };
};
