import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGameState } from "@/lib/game-state";

export async function GET(request: NextRequest) {
  try {
    const gameId = request.nextUrl.searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json(
        { error: "Missing gameId" },
        { status: 400 }
      );
    }

    // 获取游戏状态
    const gameState = await getGameState(gameId);

    if (!gameState) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    // 获取问题列表
    const questions = await prisma.question.findMany({
      where: { gameId },
      include: {
        user: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // 获取统计信息
    const totalGames = await prisma.game.count({
      where: { endedAt: { not: null } },
    });

    const totalQuestions = await prisma.question.count();

    return NextResponse.json({
      gameId,
      currentPerson: gameState.currentPerson,
      questionCount: gameState.questionCount,
      isEnded: gameState.isEnded,
      questions: questions.map((q) => ({
        id: q.id,
        content: q.content,
        aiReply: q.aiReply,
        userNickname: q.user.nickname,
        userAvatar: q.user.avatar,
        createdAt: q.createdAt,
      })),
      stats: {
        totalGuessed: totalGames,
        totalQuestions,
      },
    });
  } catch (error) {
    console.error("[API] Game state error:", error);
    return NextResponse.json(
      { error: "Failed to get game state" },
      { status: 500 }
    );
  }
}

