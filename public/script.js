document.getElementById("summarizeButton").addEventListener("click", async () => {
  const text = document.getElementById("inputText").value.trim();
  const tone = document.getElementById("toneSelect").value;
  const button = document.getElementById("summarizeButton");
  const resultSection = document.getElementById("resultSection");
  const summaryText = document.getElementById("summaryText");
  const audio = document.getElementById("summaryAudio");

  if (!text) {
    alert("文章を入力してください！");
    return;
  }

  // 結果セクションと音声プレーヤーをクリア
  resultSection.style.display = "none";
  summaryText.textContent = "";
  audio.src = "";
  audio.style.display = "none";

  // ローディング表示を開始
  const originalText = button.textContent;
  button.textContent = "要約中...";
  button.disabled = true;

  try {
    const res = await fetch("/api/imakita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: text,
        input_type: "text",
        output_type: "audio",
        tone,
      }),
    });

    const data = await res.json();

    // 結果を表示
    resultSection.style.display = "block";
    summaryText.textContent = data.summary;

    if (data.audio_url) {
      audio.src = data.audio_url;
      audio.playbackRate = 1.25;
      audio.style.display = "block";
    } else {
      audio.style.display = "none";
    }
  } catch (error) {
    alert("要約処理に失敗しました。もう一度お試しください。");
    console.error(error);
  } finally {
    // ローディング表示を終了
    button.textContent = originalText;
    button.disabled = false;
  }
});
