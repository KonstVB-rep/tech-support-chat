// Твой файл прокси-слоя
import { auth } from "@/app/lib/auth"; // 🚀 Импортируем НАПРЯМУЮ объект auth из Better Auth
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/auth/sign-in",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 🎯 ИСПРАВЛЕНО: Достаем сессию напрямую из request.headers входящего запроса!
  // Это нативное API Better Auth для прокси, оно никогда не упадёт в краш и работает со скоростью света!
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  console.log("🔍 Настоящая сессия в прокси:", session);

  if (!session?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Если это переход по ссылке в браузере — жестко выкидываем на авторизацию
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Если учетка забанена софт-блоком увольнения
  if (session.user.isActive === false) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Аккаунт деактивирован" },
        { status: 403 },
      );
    }
    const signOutUrl = new URL("/auth/sign-in", request.url);
    signOutUrl.searchParams.set("error", "account_disabled");
    return NextResponse.redirect(signOutUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/organization/:path*",
    "/account/:path*",
    "/admin/:path*",
    "/chats/:path*",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
