import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOrCreateUser(
  nickname: string,
  avatar: string
): Promise<string> {
  let user = await prisma.user.findFirst({
    where: { nickname },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { nickname, avatar },
    });
  }

  return user.id;
}

export async function getGameQuestions(gameId: string) {
  return await prisma.question.findMany({
    where: { gameId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getHistoricalFigures() {
  return await prisma.historicalFigure.findMany({
    include: {
      games: {
        where: { endedAt: { not: null } },
        include: { questions: true },
      },
    },
  });
}

export async function getCompletedGames() {
  return await prisma.game.findMany({
    where: { endedAt: { not: null } },
    include: {
      historicalFigure: true,
      questions: { include: { user: true } },
    },
    orderBy: { endedAt: "desc" },
  });
}

export async function getGameStats() {
  const completedGames = await prisma.game.findMany({
    where: { endedAt: { not: null } },
  });

  const allQuestions = await prisma.question.findMany();

  return {
    totalGuessed: completedGames.length,
    totalQuestions: allQuestions.length,
  };
}
