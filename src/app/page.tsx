import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";

export default async function Home() {
  const sb = createClient();
  const { data } = await sb.auth.getUser();
  if (data.user) redirect("/wardrobe");

  return (
    <>
      <Nav />
      <main className="main">
        <div className="container">
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", paddingTop: "var(--s-7)" }}>
            <span className="pill" style={{ marginBottom: "var(--s-5)" }}>AI-powered styling</span>
            <h1 style={{ marginTop: "var(--s-5)" }}>
              Your wardrobe,<br />
              <em style={{ fontStyle: "italic", color: "var(--fg-muted)" }}>reimagined</em>
            </h1>
            <p style={{ fontSize: "1.125rem", marginTop: "var(--s-5)", marginBottom: "var(--s-7)" }}>
              Upload what you own. Get outfit suggestions in seconds. Generate inspiration for any occasion.
            </p>
            <div style={{ display: "flex", gap: "var(--s-3)", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/signup" className="btn btn-primary btn-lg">Get started — it's free</Link>
              <Link href="/login" className="btn btn-secondary btn-lg">I have an account</Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--s-5)",
              marginTop: "var(--s-8)",
            }}
          >
            <Feature
              number="01"
              title="Build your wardrobe"
              body="Snap a photo of any item. AI tags the category, color, season, and style automatically."
            />
            <Feature
              number="02"
              title="Get outfit picks"
              body="Tell it where you're going. It pulls real combinations from the clothes you already own."
            />
            <Feature
              number="03"
              title="Generate inspiration"
              body="Describe an idea — '90s streetwear brunch fit' — and see it rendered as a fashion image."
            />
          </div>
        </div>
      </main>
    </>
  );
}

function Feature({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="card">
      <span className="subtle" style={{ fontFamily: "Fraunces, serif", fontSize: "0.875rem" }}>
        {number}
      </span>
      <h3 style={{ marginTop: "var(--s-3)", marginBottom: "var(--s-2)" }}>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
