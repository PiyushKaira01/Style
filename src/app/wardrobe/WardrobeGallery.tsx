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
          background: "var(--bg-elevated)",
          border: "1px dashed var(--border-strong)",
          borderRadius: "var(--r-lg)",
        }}
      >
        <h3 style={{ marginBottom: "var(--s-3)" }}>Your wardrobe is empty</h3>
        <p style={{ maxWidth: 380, margin: "0 auto" }}>
          Click <strong>+ Add item</strong> above to upload your first piece of clothing.
          The AI will tag it automatically.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "var(--s-4)",
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
          <div style={{ padding: "var(--s-3) var(--s-4) var(--s-4)" }}>
            {item.category && (
              <span className={`pill pill-cat-${item.category}`}>{item.category}</span>
            )}
            {item.description && (
              <p style={{ fontSize: "0.875rem", marginTop: "var(--s-2)", color: "var(--fg)" }}>
                {item.description}
              </p>
            )}
            {item.color && (
              <p style={{ fontSize: "0.75rem", marginTop: "var(--s-1)", color: "var(--fg-subtle)" }}>
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
              top: 10,
              right: 10,
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--border)",
              color: "var(--fg-muted)",
              fontSize: 18,
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