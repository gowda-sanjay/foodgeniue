import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export function initPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export function getPrisma() {
  if (!prisma) {
    throw new Error('Prisma client has not been initialized');
  }
  return prisma;
}
