"use client";

import type { GeneratedOutfit } from "@/lib/types";

export default function Gallery({ initial }: { initial: GeneratedOutfit[] }) {
  if (initial.length === 0) return null;
  return (
    <section style={{ marginTop: "var(--s-8)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          paddingBottom: "var(--s-4)",
          marginBottom: "var(--s-6)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h2 style={{ fontStyle: "italic", fontWeight: 300 }}>Your generated looks</h2>
        <span className="label">
          {initial.length} {initial.length === 1 ? "image" : "images"}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "var(--s-6)",
        }}
      >
        {initial.map((g) => (
          <article
            key={g.id}
            className="card"
            style={{ padding: 0, overflow: "hidden" }}
          >
            <div style={{ aspectRatio: "1 / 1", background: "var(--bg-subtle)" }}>
              <img
                src={g.image_url}
                alt={g.prompt}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <p
              style={{
                padding: "var(--s-4)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--fg-muted)",
                margin: 0,
              }}
            >
              {g.prompt}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}