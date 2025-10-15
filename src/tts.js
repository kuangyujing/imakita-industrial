import "dotenv/config";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * トーンに応じた音声を選択する
 * @param {string} tone - 要約のトーン
 * @returns {string} OpenAI TTS API の音声名
 */
function selectVoiceByTone(tone) {
  const voiceMap = {
    "普通": "nova",          // 明るく活発な女性声
    "ニュース風": "onyx",     // 深みのある落ち着いた声
    "ツンデレ": "shimmer",    // 柔らかく優しい女性声
    "関西弁": "nova",         // 明るく元気な女性声
    "ホラー調": "echo",       // 男性的でやや不気味な声
  };

  return voiceMap[tone] || "nova"; // デフォルトはnova
}

/**
 * テキストを音声（MP3）に変換する
 * @param {string} text - 音声化したいテキスト
 * @param {string} tone - 要約のトーン（音声選択に使用）
 * @returns {Promise<string>} 生成された音声ファイルのパス
 */
export async function textToSpeech(text, tone = "普通") {
  const outputPath = path.join("/tmp", `imakita_${Date.now()}.mp3`);
  const voice = selectVoiceByTone(tone);

  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: voice,
    input: text,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}
