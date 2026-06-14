import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  await prisma.question.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();
  await prisma.historicalFigure.deleteMany();

  console.log("✓ Database reset complete");
  await prisma.$disconnect();
}

resetDatabase().catch((e) => {
  console.error("Error resetting database:", e);
  process.exit(1);
});
