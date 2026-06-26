// src/shared/lib/server-auth.ts
"use server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

// ✅ Кешируем запрос сессии на один render
export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

// ✅ Получить текущего пользователя
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  return session?.user ?? null;
});

// ✅ Требовать авторизацию (редирект если нет)
export const requireAuth = async (redirectUrl = "/login") => {
  const user = await getCurrentUser();
  if (!user) {
    redirect(redirectUrl);
  }
  return user;
};

// ✅ Требовать определённую роль
export const requireRole = async (
  allowedRoles: string[],
  redirectUrl = "/",
) => {
  const user = await requireAuth(redirectUrl);
  if (!allowedRoles.includes(user.role)) {
    redirect(redirectUrl);
  }
  return user;
};
