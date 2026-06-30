"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/wardrobe");
    router.refresh();
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Pick up where you left off."
      footer={<>New here? <Link href="/signup" style={{ color: "var(--fg)", fontWeight: 500 }}>Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "var(--s-4)" }}>
        <div className="field">
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: "var(--s-2)" }}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
