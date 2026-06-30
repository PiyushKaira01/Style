"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setMessage("Check your email to confirm, then log in.");
    setLoading(false);
  }

  return (
    <AuthShell
      title="Create your wardrobe"
      subtitle="A few seconds is all it takes."
      footer={<>Already have an account? <Link href="/login" style={{ color: "var(--fg)", fontWeight: 500 }}>Log in</Link></>}
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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-info">{message}</div>}
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: "var(--s-2)" }}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
