import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePerson } from "@/lib/ai";
import { startNewGame, updatePersonName } from "@/lib/game-state";

export async function POST(request: NextRequest) {
  try {
    const { nickname, avatar } = await request.json();

    if (!nickname || !avatar) {
      return NextResponse.json(
        { error: "Missing nickname or avatar" },
        { status: 400 }
      );
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        nickname,
        avatar,
      },
    });

    // 创建新游戏
    const gameState = await startNewGame();

    // 生成AI选择的人物名字
    let personName = "秦始皇";
    try {
      personName = await generatePerson();
      await updatePersonName(gameState.gameId, personName);
    } catch (error) {
      console.warn("[API] Failed to generate person name, using default:", error);
    }

    return NextResponse.json({
      userId: user.id,
      gameId: gameState.gameId,
      success: true,
    });
  } catch (error) {
    console.error("[API] Init error:", error);
    return NextResponse.json(
      { error: "Init failed" },
      { status: 500 }
    );
  }
}

