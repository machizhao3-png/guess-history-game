import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePerson } from "@/lib/ai";
import { startNewGame, updatePersonName } from "@/lib/game-state";

export async function POST(request: NextRequest) {
  try {
    const { nickname, avatar } = await request.json();

    console.log("[API/init] Received request:", { nickname, avatar });

    if (!nickname || !avatar) {
      console.warn("[API/init] Missing nickname or avatar");
      return NextResponse.json(
        { error: "Missing nickname or avatar" },
        { status: 400 }
      );
    }

    // 创建用户
    console.log("[API/init] Creating user...");
    const user = await prisma.user.create({
      data: {
        nickname,
        avatar,
      },
    });
    console.log("[API/init] User created:", user.id);

    // 创建新游戏
    console.log("[API/init] Starting new game...");
    const gameState = await startNewGame();
    console.log("[API/init] Game started:", gameState.gameId);

    // 生成AI选择的人物名字
    let personName = "秦始皇";
    try {
      console.log("[API/init] Generating person name...");
      personName = await generatePerson();
      console.log("[API/init] Person name generated:", personName);
      await updatePersonName(gameState.gameId, personName);
      console.log("[API/init] Person name updated");
    } catch (error) {
      console.warn("[API/init] Failed to generate person name, using default:", error);
    }

    const response = {
      userId: user.id,
      gameId: gameState.gameId,
      success: true,
    };

    console.log("[API/init] Sending response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API/init] Error:", error);
    console.error("[API/init] Error type:", typeof error);
    console.error("[API/init] Error constructor:", error?.constructor?.name);

    if (error instanceof Error) {
      console.error("[API/init] Error message:", error.message);
      console.error("[API/init] Error stack:", error.stack);
      console.error("[API/init] Error name:", error.name);
    }

    // Log Prisma-specific error details
    if (error && typeof error === 'object' && 'code' in error) {
      console.error("[API/init] Prisma error code:", (error as any).code);
      console.error("[API/init] Prisma meta:", (error as any).meta);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Init failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

