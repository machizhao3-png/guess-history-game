import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

console.log("[Prisma] Initializing Prisma Client");
console.log("[Prisma] NODE_ENV:", process.env.NODE_ENV);
console.log("[Prisma] DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("[Prisma] DATABASE_URL prefix:", process.env.DATABASE_URL?.substring(0, 20));

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "production" ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
