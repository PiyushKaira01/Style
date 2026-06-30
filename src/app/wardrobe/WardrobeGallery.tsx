"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WardrobeItem } from "@/lib/types";

export default function WardrobeGallery({ initialItems }: { initialItems: WardrobeItem[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    setDeleting(id);
    await fetch(`/api/wardrobe/${id}`, { method: "DELETE" });
    setDeleting(null);
    router.refresh();
  }

  if (initialItems.length === 0) {
    return (
      <div
        style={{
          padding: "var(--s-8) var(--s-5)",
          textAlign: "center",
          background: "transparent",
          border: "1px dashed var(--border-strong)",
          borderRadius: "2px",
        }}
      >
        <span className="label" style={{ display: "block", marginBottom: "var(--s-3)" }}>
          Empty
        </span>
        <h3 style={{ marginBottom: "var(--s-3)", fontWeight: 400, fontStyle: "italic" }}>
          Your wardrobe is empty
        </h3>
        <p style={{ maxWidth: 380, margin: "0 auto" }}>
          Click <strong>+ Add item</strong> above to upload your first piece. The AI will tag it automatically.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "var(--s-6)",
      }}
    >
      {initialItems.map((item) => (
        <article
          key={item.id}
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
            position: "relative",
            opacity: deleting === item.id ? 0.5 : 1,
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              aspectRatio: "1 / 1",
              background: "var(--bg-subtle)",
              overflow: "hidden",
            }}
          >
            <img
              src={item.image_url}
              alt={item.description ?? "wardrobe item"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <div style={{ padding: "var(--s-4) var(--s-4) var(--s-5)" }}>
            {item.category && (
              <span className={`pill pill-cat-${item.category}`}>{item.category}</span>
            )}
            {item.description && (
              <p style={{ fontSize: "0.9375rem", marginTop: "var(--s-3)", color: "var(--fg)" }}>
                {item.description}
              </p>
            )}
            {item.color && (
              <p style={{ fontSize: "0.6875rem", marginTop: "var(--s-2)", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--fg-subtle)" }}>
                {item.color}
                {item.season ? ` · ${item.season}` : ""}
                {item.style ? ` · ${item.style}` : ""}
              </p>
            )}
          </div>
          <button
            onClick={() => handleDelete(item.id)}
            aria-label="Delete item"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              borderRadius: "2px",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--fg-muted)",
              fontSize: 16,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--danger)";
              e.currentTarget.style.borderColor = "var(--danger)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--fg-muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            ×
          </button>
        </article>
      ))}
    </div>
  );
}