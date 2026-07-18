import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  console.log("Enabling pgvector extension on Supabase...");
  try {
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log("SUCCESS: pgvector extension enabled.");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected.");
  }
}

run();
