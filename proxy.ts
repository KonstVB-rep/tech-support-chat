import { getServerSession } from "@/app/lib/get-session";
// import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const session = await getServerSession();

  if (!session?.user) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (session.user.isActive === false) {
    const signOutUrl = new URL("/auth/sign-in", request.url);
    signOutUrl.searchParams.set("error", "account_disabled");
    return NextResponse.redirect(signOutUrl);
  }

  // ✅ Защита по ролям - админские роуты
  // if (pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // // ✅ Защита по ролям - инженеры поддержки
  // if (
  //   pathname.startsWith("/support") &&
  //   session.user.role !== "SUPPORT" &&
  //   session.user.role !== "ADMIN"
  // ) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  return NextResponse.next();
  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  // if (!session) {
  //   return NextResponse.redirect(new URL("/[auth]/sign-in", request.url))
  // }
  // return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard",
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
