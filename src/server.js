import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { summarize } from "./summarizer.js";
import { textToSpeech } from "./tts.js";
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// SPA配信
app.use(express.static(path.join(__dirname, "../public")));

// 今北産業API
app.post("/api/imakita", async (req, res) => {
  try {
    const { input, tone, output_type } = req.body;
    const summary = await summarize(input, tone);

    if (output_type === "audio") {
      const filePath = await textToSpeech(summary, tone);
      res.json({
        summary,
        audio_url: `/audio/${path.basename(filePath)}`,
      });
    } else {
      res.json({ summary });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "要約処理に失敗しました。" });
  }
});

// 音声ファイル配信
app.use("/audio", express.static("/tmp"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
