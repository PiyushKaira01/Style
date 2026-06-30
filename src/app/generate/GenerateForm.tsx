"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRESETS = [
  "Cozy fall coffee shop look",
  "Elegant black-tie gala outfit",
  "90s streetwear casual fit",
  "Boho summer festival outfit",
  "Monochrome minimalist work look",
];

export default function GenerateForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(PRESETS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");
      setPrompt("");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ display: "grid", gap: "var(--s-5)" }}>
      <div className="field">
        <label className="field-label" htmlFor="prompt">Describe the outfit</label>
        <textarea
          id="prompt"
          className="textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Cozy fall coffee shop look"
          required
          rows={3}
        />
      </div>
      <div style={{ display: "flex", gap: "var(--s-2)", flexWrap: "wrap" }}>
        {PRESETS.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => setPrompt(p)}
            className="btn-ghost"
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              padding: "6px 0",
              marginRight: "var(--s-3)",
            }}
          >
            {p}
          </button>
        ))}
      </div>
      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? "Generating image…" : "Generate →"}
      </button>
      {error && <div className="alert alert-error">{error}</div>}
    </form>
  );
}