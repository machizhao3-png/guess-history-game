import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    // 获取已完成的游戏
    const games = await prisma.game.findMany({
      where: { endedAt: { not: null } },
      include: {
        historicalFigure: true,
        questions: {
          include: { user: true },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { endedAt: "desc" },
      take: pageSize,
      skip,
    });

    // 统计信息
    const totalGames = await prisma.game.count({
      where: { endedAt: { not: null } },
    });

    const totalQuestions = await prisma.question.count();

    // 转换为前端格式
    const history = games.map((game) => ({
      figureName: game.historicalFigure.name,
      guessedBy: game.guessedBy || "Unknown",
      questionCount: game.questionCount,
      endedAt: game.endedAt,
      questions: game.questions.map((q) => ({
        content: q.content,
        aiReply: q.aiReply,
        userNickname: q.user.nickname,
        userAvatar: q.user.avatar,
      })),
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalGuessed: totalGames,
        totalQuestions,
      },
      history,
      pagination: {
        page,
        pageSize,
        total: totalGames,
        totalPages: Math.ceil(totalGames / pageSize),
      },
    });
  } catch (error) {
    console.error("[API] History error:", error);
    return NextResponse.json(
      { error: "Failed to get history" },
      { status: 500 }
    );
  }
}

