// src/app/api/uploads/[...path]/route.ts

import { readFile } from "node:fs/promises"
import path from "node:path"
import { type NextRequest, NextResponse } from "next/server"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/opt/chat-app/uploads"

const contentTypes: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".zip": "application/zip",
  ".txt": "text/plain",
  ".csv": "text/csv",
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: segments } = await params
    const filePath = path.join(/* turbopackIgnore: true */ UPLOAD_DIR, ...segments)
    const uploadRoot = path.resolve(/* turbopackIgnore: true */ UPLOAD_DIR)
    const resolved = path.resolve(filePath)

    if (!resolved.startsWith(uploadRoot)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const buffer = await readFile(resolved)
    const ext = path.extname(resolved).toLowerCase()
    const contentType = contentTypes[ext] || "application/octet-stream"

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    console.error("Ошибка загрузки файла:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}
