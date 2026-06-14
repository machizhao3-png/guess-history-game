import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `你是一个中国历史知识专家。你要在一个猜历史人物的游戏中扮演一个角色。

游戏规则：
1. 玩家会提出是/否问题来猜测你心想的一个中国古代人物
2. 你只能回答5个选项之一：是 / 不是 / 不确定 / 无关 / 猜对了
3. 如果玩家直接说出人物名字，回答"猜对了"
4. 如果玩家的问题与人物无关，回答"无关"
5. 如果你不确定答案，回答"不确定"

你选择的人物应该是真实存在的中国古代历史人物（包括皇帝、将军、文人等）。`;

export interface AIResponse {
  reply: "是" | "不是" | "不确定" | "无关" | "猜对了";
  error?: string;
}

export async function generatePerson(
  excludedFigures: string[] = []
): Promise<string> {
  const exclusionText =
    excludedFigures.length > 0
      ? `\n\n请避免选择这些已经被猜过的人物：${excludedFigures.join("、")}`
      : "";

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 100,
        system: SYSTEM_PROMPT + exclusionText,
        messages: [
          {
            role: "user",
            content: "请选择一个中国古代历史人物，只回复人物名字，不要有其他内容。",
          },
        ],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";
      return text.trim();
    } catch (error) {
      if (attempt < 2) {
        console.warn(`[AI] Retry generatePerson attempt ${attempt + 1}`);
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      } else {
        throw error;
      }
    }
  }

  return "秦始皇";
}

export async function answerQuestion(
  person: string,
  question: string
): Promise<AIResponse> {
  try {
    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 10,
      system: `${SYSTEM_PROMPT}\n\n我心想的人物是：${person}`,
      messages: [
        {
          role: "user",
          content: `玩家的问题是：${question}\n\n请只回答"是"、"不是"、"不确定"、"无关"或"猜对了"中的一个词。`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const reply = text.trim();

    if (["是", "不是", "不确定", "无关", "猜对了"].includes(reply)) {
      return { reply: reply as AIResponse["reply"] };
    }

    return { reply: "不确定", error: `Invalid reply: ${reply}` };
  } catch (error) {
    console.error("[AI] Error answering question:", error);
    return { reply: "不确定", error: String(error) };
  }
}

export async function checkGuess(
  person: string,
  guess: string
): Promise<boolean> {
  return guess.includes(person) || person.includes(guess);
}
