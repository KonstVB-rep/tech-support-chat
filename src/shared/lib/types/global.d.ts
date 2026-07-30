// src/shared/lib/types/global.d.ts
import type { Server as SocketServer } from "socket.io"
import type { PrismaClient } from "@prisma/client"

declare global {
  var io: SocketServer | undefined
  var prisma: PrismaClient | undefined
}
