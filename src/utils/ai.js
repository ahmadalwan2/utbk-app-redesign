import { getApiKey, getProvider, PROVIDERS } from './storage';

async function callAnthropic(apiKey, systemPrompt, userMessage) {
  const response = await fetch("/api/anthropic/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      stream: false,
    }),
  });
  if (!response.ok) throw new Error(`Error ${response.status}`);
  const data = await response.json();
  return data.content?.map(b => b.text || "").join("") || "Maaf, terjadi kesalahan.";
}

async function callGemini(apiKey, systemPrompt, userMessage) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: 1000 },
    }),
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    if (response.status === 429) {
      throw new Error(`Error 429: Kuota API Key kamu habis atau terlalu banyak request dalam waktu singkat. Coba gunakan API Key lain.`);
    }
    throw new Error(`Error ${response.status}: ${errData?.error?.message || ''}`);
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "Maaf, terjadi kesalahan.";
}

export async function askAI(systemPrompt, userMessage, onChunk) {
  const apiKey = getApiKey();
  const provider = getProvider();
  if (!apiKey) {
    const errMsg = "⚠️ API Key belum diatur. Silakan klik ikon ⚙️ di halaman utama untuk memasukkan API Key.";
    if (onChunk) onChunk(errMsg);
    return errMsg;
  }
  try {
    const text = provider === "anthropic"
      ? await callAnthropic(apiKey, systemPrompt, userMessage)
      : await callGemini(apiKey, systemPrompt, userMessage);
    if (onChunk) onChunk(text);
    return text;
  } catch (err) {
    const text = `⚠️ Gagal (${PROVIDERS[provider].name}): ${err.message}`;
    if (onChunk) onChunk(text);
    return text;
  }
}
