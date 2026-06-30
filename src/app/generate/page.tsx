import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import GenerateForm from "./GenerateForm";
import Gallery from "./Gallery";

export default async function GeneratePage() {
  const sb = createClient();
  const { data: userRes } = await sb.auth.getUser();
  if (!userRes.user) redirect("/login");

  const { data: generated } = await sb
    .from("generated_outfits")
    .select("*")
    .eq("user_id", userRes.user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <>
      <Nav loggedIn />
      <main className="main">
        <div className="container">
          <header
            style={{
              marginBottom: "var(--s-7)",
              textAlign: "center",
              paddingBottom: "var(--s-6)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span className="label" style={{ display: "block", marginBottom: "var(--s-3)" }}>
              N° 03 — AI image generation
            </span>
            <h1 style={{ fontStyle: "italic", fontWeight: 300 }}>Outfit inspiration</h1>
            <p style={{ marginTop: "var(--s-3)", fontSize: "1.0625rem", maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
              Describe an outfit idea and I'll render it as a fashion image for you.
            </p>
          </header>

          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <GenerateForm />
          </div>

          <Gallery initial={generated ?? []} />
        </div>
      </main>
    </>
  );
}