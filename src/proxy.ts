import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicRoutes = [
    "/auth/sign-in",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/api/auth",
  ]

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  const staticPaths = [
    "/manifest.webmanifest",
    "/sw.js",
    "/icon-192x192.png",
    "/icon-512x512.png",
    "/screenshot-wide.png",
    "/screenshot-mobile.png",
    "/favicon.ico",
    "/_next/",
  ]

  if (staticPaths.some((path) => pathname.startsWith(path) || pathname === path)) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const signInUrl = new URL("/auth/sign-in", request.url)
    signInUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (session.user.isActive === false) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Аккаунт деактивирован" }, { status: 403 })
    }
    const signOutUrl = new URL("/auth/sign-in", request.url)
    signOutUrl.searchParams.set("error", "account_disabled")
    return NextResponse.redirect(signOutUrl)
  }

  return NextResponse.next()
}
