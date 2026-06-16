// prisma/db.ts

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Защита от undefined — если DATABASE_URL нет, сразу падаем с понятной ошибкой
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing in .env — Prisma cannot connect to MySQL",
  );
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
