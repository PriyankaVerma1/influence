import React, { useState } from "react";
import { generateScript } from "@/lib/openai";

const ScriptGenerator: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("short");
  const [tone, setTone] = useState("friendly");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic or brief.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult("");
    try {
      const script = await generateScript({ topic, length, tone, audience });
      setResult(script.trim());
    } catch (err: any) {
      setError(err?.message || "Failed to generate script");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
    } catch {
      // ignore
    }
  };

  return (
    <section className="max-w-4xl mx-auto my-12 p-6 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-3">AI Script Writer</h2>
      <p className="text-sm text-muted-foreground mb-4">Generate short creator scripts using OpenAI.</p>

      <div className="grid grid-cols-1 gap-3">
        <label className="flex flex-col">
          <span className="text-sm font-medium mb-1">Topic / Brief</span>
          <input
            className="input input-bordered w-full"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="E.g., 30-second script about morning routine hacks"
          />
        </label>

        <div className="flex gap-3">
          <label className="flex-1">
            <span className="text-sm font-medium mb-1">Length</span>
            <select className="select select-bordered w-full" value={length} onChange={(e) => setLength(e.target.value)}>
              <option value="short">Short (15-30s)</option>
              <option value="medium">Medium (30-60s)</option>
              <option value="long">Long (60-120s)</option>
            </select>
          </label>

          <label className="flex-1">
            <span className="text-sm font-medium mb-1">Tone</span>
            <select className="select select-bordered w-full" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="friendly">Friendly</option>
              <option value="energetic">Energetic</option>
              <option value="professional">Professional</option>
            </select>
          </label>
        </div>

        <label>
          <span className="text-sm font-medium mb-1">Audience (optional)</span>
          <input className="input input-bordered w-full" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g., beginners, busy parents" />
        </label>

        <div className="flex gap-3">
          <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating…" : "Generate Script"}
          </button>
          <button className="btn" onClick={() => { setTopic(""); setAudience(""); setResult(""); setError(null); }}>
            Clear
          </button>
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}

        {result && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Generated Script</h3>
              <div className="flex gap-2">
                <button className="btn btn-sm" onClick={handleCopy}>Copy</button>
                <a className="btn btn-sm" href={`data:text/plain;charset=utf-8,${encodeURIComponent(result)}`} download="script.txt">Download</a>
              </div>
            </div>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded text-sm">{result}</pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScriptGenerator;
