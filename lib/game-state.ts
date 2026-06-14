import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface GameState {
  gameId: string;
  currentPerson: string;
  questionCount: number;
  isEnded: boolean;
}

let currentGameState: GameState | null = null;

export async function initGameState(): Promise<GameState> {
  const latestGame = await prisma.game.findFirst({
    where: { endedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (latestGame) {
    currentGameState = {
      gameId: latestGame.id,
      currentPerson: (await prisma.historicalFigure.findUnique({
        where: { id: latestGame.historicalFigureId },
      }))?.name || "",
      questionCount: latestGame.questionCount,
      isEnded: false,
    };
  }

  return currentGameState || (await startNewGame());
}

export async function startNewGame(): Promise<GameState> {
  const historicalFigure = await prisma.historicalFigure.create({
    data: {
      name: `Temp_${Date.now()}`,
    },
  });

  const game = await prisma.game.create({
    data: {
      historicalFigureId: historicalFigure.id,
    },
  });

  currentGameState = {
    gameId: game.id,
    currentPerson: historicalFigure.name,
    questionCount: 0,
    isEnded: false,
  };

  return currentGameState;
}

export async function updatePersonName(
  gameId: string,
  personName: string
): Promise<void> {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game) return;

  await prisma.historicalFigure.update({
    where: { id: game.historicalFigureId },
    data: { name: personName },
  });

  if (currentGameState?.gameId === gameId) {
    currentGameState.currentPerson = personName;
  }
}

export async function addQuestion(
  gameId: string,
  userId: string,
  question: string,
  aiReply: string
): Promise<void> {
  await prisma.question.create({
    data: {
      gameId,
      userId,
      content: question,
      aiReply,
    },
  });

  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (game) {
    await prisma.game.update({
      where: { id: gameId },
      data: { questionCount: game.questionCount + 1 },
    });

    if (currentGameState?.gameId === gameId) {
      currentGameState.questionCount = game.questionCount + 1;
    }
  }
}

export async function endGame(gameId: string, guessedBy: string): Promise<void> {
  await prisma.game.update({
    where: { id: gameId },
    data: { endedAt: new Date(), guessedBy },
  });

  if (currentGameState?.gameId === gameId) {
    currentGameState.isEnded = true;
  }
}

export function getCurrentGameState(): GameState | null {
  return currentGameState;
}

export async function getGameState(gameId: string): Promise<GameState | null> {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game) return null;

  const figure = await prisma.historicalFigure.findUnique({
    where: { id: game.historicalFigureId },
  });

  return {
    gameId: game.id,
    currentPerson: figure?.name || "",
    questionCount: game.questionCount,
    isEnded: game.endedAt !== null,
  };
}
