"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadButton() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  async function compress(file: File, maxDim = 1024): Promise<string> {
    const dataUrl = await fileToDataUrl(file);
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("image load failed"));
      img.src = dataUrl;
    });
    const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
    const w = Math.round(img.width * ratio);
    const h = Math.round(img.height * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.82);
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setUploading(true);
    setError(null);
    setProgress("Compressing image…");
    try {
      const compressed = await compress(file);
      setProgress("Uploading & tagging with AI…");
      const res = await fetch("/api/wardrobe/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressed }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setProgress("Done!");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress("");
      }, 1200);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        disabled={uploading}
        style={{ display: "none" }}
        id="upload-input"
      />
      <label
        htmlFor="upload-input"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className="btn btn-primary"
        style={{
          background: drag ? "var(--bg)" : undefined,
          color: drag ? "var(--fg)" : undefined,
          border: drag ? "1px dashed var(--fg)" : undefined,
          cursor: "pointer",
        }}
      >
        {uploading ? progress || "Working…" : "+ Add item"}
      </label>
      {error && (
        <div className="alert alert-error" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, whiteSpace: "nowrap" }}>
          {error}
        </div>
      )}
    </div>
  );
}