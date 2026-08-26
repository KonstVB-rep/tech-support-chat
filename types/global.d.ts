import type { Server as SocketServer } from "socket.io";
import type { PrismaClient } from "@prisma/client";
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}

declare global {
  var io: SocketServer | undefined;
  var prisma: PrismaClient | undefined;
}

export {};
