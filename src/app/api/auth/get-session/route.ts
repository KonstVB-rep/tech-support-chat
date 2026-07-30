// src/app/api/auth/get-session/route.ts

import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
    })
  } catch (error) {
    console.error("Ошибка получения сессии:", error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
