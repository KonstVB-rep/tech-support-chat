import { auth } from "@/app/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ 1. Публичные маршруты (без проверки авторизации)
  const publicRoutes = [
    "/auth/sign-in",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/api/auth",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // ✅ 2. ИСКЛЮЧЕНИЯ для статики и PWA (ДО проверки сессии!)
  const staticPaths = [
    "/manifest.webmanifest",
    "/sw.js",
    "/icon-192x192.png",
    "/icon-512x512.png",
    "/screenshot-wide.png",
    "/screenshot-mobile.png",
    "/favicon.ico",
    "/_next/",  // Все статические файлы Next.js (CSS, JS, шрифты)
  ];

  if (staticPaths.some((path) => pathname.startsWith(path) || pathname === path)) {
    return NextResponse.next();
  }

  // ✅ 3. Проверка сессии
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  console.log("🔍 Настоящая сессия в прокси:", session);

  if (!session?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // ✅ 4. Проверка активности
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
