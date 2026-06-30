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
          {/* Hero */}
          <section
            style={{
              paddingTop: "var(--s-7)",
              paddingBottom: "var(--s-8)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr",
                gap: "var(--s-7)",
                alignItems: "end",
              }}
            >
              <div>
                <span className="label" style={{ display: "block", marginBottom: "var(--s-5)" }}>
                  N° 01 — A wardrobe that thinks
                </span>
                <h1 style={{ fontStyle: "italic" }}>
                  Style, quietly
                  <br />
                  considered.
                </h1>
              </div>
              <div style={{ paddingBottom: "var(--s-3)" }}>
                <p style={{ fontSize: "1.0625rem", marginBottom: "var(--s-5)", maxWidth: 420 }}>
                  Upload what you own. Get outfit suggestions in seconds. Generate inspiration for any occasion — from the closet you already live in.
                </p>
                <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap", alignItems: "center" }}>
                  <Link href="/signup" className="btn btn-primary btn-lg">Begin →</Link>
                  <Link href="/login" className="btn-ghost">I have an account</Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section style={{ paddingTop: "var(--s-8)" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "var(--s-6)",
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
                body="Describe an idea — “90s streetwear brunch fit” — and see it rendered as a fashion image."
              />
            </div>
          </section>

          {/* Closing */}
          <section
            style={{
              marginTop: "var(--s-8)",
              paddingTop: "var(--s-7)",
              borderTop: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontStyle: "italic",
                fontSize: "1.5rem",
                color: "var(--fg)",
                marginBottom: "var(--s-5)",
              }}
            >
              A closet worth coming home to.
            </p>
            <Link href="/signup" className="btn btn-secondary btn-lg">Create your wardrobe</Link>
          </section>
        </div>
      </main>
    </>
  );
}

function Feature({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--s-5)" }}>
      <span
        className="label"
        style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: "0.9375rem", letterSpacing: 0, textTransform: "none", color: "var(--fg-subtle)" }}
      >
        N° {number}
      </span>
      <h3 style={{ marginTop: "var(--s-3)", marginBottom: "var(--s-3)", fontWeight: 400 }}>{title}</h3>
      <p style={{ fontSize: "0.9375rem" }}>{body}</p>
    </div>
  );
}