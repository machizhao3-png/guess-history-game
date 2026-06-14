import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function migrateData() {
  try {
    console.log("🚀 开始数据迁移...");

    // 1. 迁移HistoricalFigure
    console.log("📝 迁移HistoricalFigure...");
    const historicalFigures = await prisma.historicalFigure.findMany();
    if (historicalFigures.length > 0) {
      await supabase.from("HistoricalFigure").insert(historicalFigures);
      console.log(`✅ 迁移了 ${historicalFigures.length} 个历史人物`);
    }

    // 2. 迁移User
    console.log("👤 迁移User...");
    const users = await prisma.user.findMany();
    if (users.length > 0) {
      await supabase.from("User").insert(users);
      console.log(`✅ 迁移了 ${users.length} 个用户`);
    }

    // 3. 迁移Game
    console.log("🎮 迁移Game...");
    const games = await prisma.game.findMany();
    if (games.length > 0) {
      await supabase.from("Game").insert(games);
      console.log(`✅ 迁移了 ${games.length} 个游戏`);
    }

    // 4. 迁移Question
    console.log("❓ 迁移Question...");
    const questions = await prisma.question.findMany();
    if (questions.length > 0) {
      await supabase.from("Question").insert(questions);
      console.log(`✅ 迁移了 ${questions.length} 个问题`);
    }

    console.log("✨ 数据迁移完成！");
    console.log(`
📊 迁移统计：
- HistoricalFigure: ${historicalFigures.length}
- User: ${users.length}
- Game: ${games.length}
- Question: ${questions.length}
    `);
  } catch (error) {
    console.error("❌ 迁移失败:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
