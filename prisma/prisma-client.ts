// prisma/prisma-client.ts
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prismaInstance: PrismaClient | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing in .env — Prisma cannot connect to MySQL",
  );
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

const instance =
  globalThis.__prismaInstance ||
  new PrismaClient({
    adapter,
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaInstance = instance;
}

export const prisma = instance;