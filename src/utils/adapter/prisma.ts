import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const env = process.env;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter: new PrismaPg({
        connectionString: `${env.POSTGRES_URL}`,
    }),
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;