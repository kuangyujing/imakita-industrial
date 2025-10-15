import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 入力テキストを「今北産業」風に3行で要約する
 * @param {string} text - 入力文章
 * @param {string} tone - トーン（例：普通, ツンデレ, ニュース風）
 * @returns {Promise<string>} 3行の要約結果
 */
export async function summarize(text, tone = "普通") {
  const prompt = `
次の文章を「今北産業」風に3行で要約してください。
各行は「・」から始めてください。
トーン: ${tone}
---
${text}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const summary = response.choices[0].message.content?.trim() || "";
  return summary;
}
