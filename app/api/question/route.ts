import { NextRequest, NextResponse } from "next/server";
import { answerQuestion, checkGuess } from "@/lib/ai";
import { addQuestion, getGameState } from "@/lib/game-state";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { gameId, userId, question, userNickname, userAvatar } =
      await request.json();

    if (!gameId || !userId || !question) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    // 获取当前游戏状态
    const gameState = await getGameState(gameId);
    if (!gameState) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    // 确保用户存在
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          nickname: userNickname || "Anonymous",
          avatar: userAvatar || "🙂",
        },
      });
    }

    // 调用真实AI获取回答
    const aiResponse = await answerQuestion(gameState.currentPerson, question);

    if (aiResponse.error) {
      console.warn("[API] AI response with error:", aiResponse);
    }

    // 检查是否猜对
    let isGuessCorrect = false;
    if (aiResponse.reply === "猜对了") {
      isGuessCorrect = await checkGuess(gameState.currentPerson, question);
    }

    // 保存问题到数据库
    await addQuestion(gameId, userId, question, aiResponse.reply);

    return NextResponse.json({
      success: true,
      aiReply: aiResponse.reply,
      isGuessCorrect,
    });
  } catch (error) {
    console.error("[API] Question error:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}

