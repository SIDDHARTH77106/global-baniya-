// Standard singleton pattern for PrismaClient in Next.js
// This prevents multiple database connections during development
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Optional: Logs SQL queries in the terminal for debugging
    log: ['query'], 
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;