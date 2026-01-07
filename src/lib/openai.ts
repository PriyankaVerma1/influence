export async function generateScript(options: {
  topic: string;
  length?: string;
  tone?: string;
  audience?: string;
}) {
  const { topic, length = "medium", tone = "friendly", audience = "general" } = options;
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_OPENAI_API_KEY is not set in environment variables");
  }

  const userPrompt = `Write a creator-ready video script based on the details below. Keep it organized, easy to read, and suitable for a short-form creator video. Include short stage directions and an optional call-to-action at the end.\n\nTopic: ${topic}\nLength: ${length}\nTone: ${tone}\nAudience: ${audience}\n\nReturn only the script text.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert script writer for short creator videos." },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `OpenAI request failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
}
