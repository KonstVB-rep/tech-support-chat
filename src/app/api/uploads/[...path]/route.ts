// src/app/api/uploads/[...path]/route.ts

import { readFile } from "node:fs/promises"
import path from "node:path"
import { type NextRequest, NextResponse } from "next/server"

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/opt/chat-app/uploads"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params
  const filePath = path.join(UPLOAD_DIR, ...segments)

  // Защита от directory traversal
  const resolved = path.resolve(filePath)
  const uploadRoot = path.resolve(UPLOAD_DIR)
  if (!resolved.startsWith(uploadRoot)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const buffer = await readFile(resolved)
    const ext = path.extname(resolved).toLowerCase()

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

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentTypes[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
