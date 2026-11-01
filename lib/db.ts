import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalDb = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalDb.prisma ?? new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL }),
});

if (process.env.NODE_ENV !== "production") globalDb.prisma = prisma;
