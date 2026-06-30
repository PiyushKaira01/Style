"use client";

import { useState } from "react";
import type { WardrobeItem } from "@/lib/types";

const OCCASIONS = [
  "Casual day out",
  "Work / office",
  "Date night",
  "Wedding / formal event",
  "Workout / gym",
  "Beach / vacation",
  "Brunch with friends",
  "Interview",
];

const WEATHER = ["Hot (30°C+)", "Warm (20–30°C)", "Mild (10–20°C)", "Cool (0–10°C)", "Cold (below 0°C)"];

export default function SuggestForm({ items }: { items: Partial<WardrobeItem>[] }) {
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [weather, setWeather] = useState(WEATHER[2]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ reasoning: string; itemIds: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occasion, weather }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setResult({ reasoning: json.reasoning, itemIds: json.itemIds });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const chosen = items.filter((i) => result?.itemIds.includes(i.id!));

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ display: "grid", gap: "var(--s-5)" }}
      >
        <div className="field">
          <label className="field-label" htmlFor="occasion">Occasion</label>
          <select
            id="occasion"
            className="select"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          >
            {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="weather">Weather</label>
          <select
            id="weather"
            className="select"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          >
            {WEATHER.map((w) => <option key={w}>{w}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading || items.length === 0}>
          {loading ? "Thinking…" : "Suggest an outfit"}
        </button>
        {items.length === 0 && (
          <p style={{ fontSize: "0.875rem", textAlign: "center", color: "var(--fg-muted)" }}>
            Add a few items to your wardrobe first.
          </p>
        )}
      </form>

      {error && <div className="alert alert-error" style={{ marginTop: "var(--s-4)" }}>{error}</div>}

      {result && (
        <section className="card" style={{ marginTop: "var(--s-5)" }}>
          <span className="pill" style={{ marginBottom: "var(--s-3)" }}>My pick</span>
          <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, marginTop: "var(--s-3)", color: "var(--fg)" }}>
            {result.reasoning}
          </p>
          {chosen.length > 0 && (
            <>
              <hr className="divider" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "var(--s-3)",
                }}
              >
                {chosen.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      background: "var(--bg-subtle)",
                      borderRadius: "var(--r-md)",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ aspectRatio: "1 / 1", overflow: "hidden" }}>
                      <img
                        src={it.image_url!}
                        alt={it.description ?? ""}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    {it.description && (
                      <p style={{ padding: "var(--s-2) var(--s-3)", fontSize: "0.8125rem", color: "var(--fg-muted)" }}>
                        {it.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}