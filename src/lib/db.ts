import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// For PostgreSQL (production), swap this adapter:
//   npm install @prisma/adapter-pg pg
//   import { Pool } from "pg";
//   import { PrismaPg } from "@prisma/adapter-pg";
//   const adapter = new PrismaPg(new Pool({ connectionString: url }));

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const dbPath = url.replace("file:", "");
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
