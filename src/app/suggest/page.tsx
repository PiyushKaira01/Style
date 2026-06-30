import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import SuggestForm from "./SuggestForm";

export default async function SuggestPage() {
  const sb = createClient();
  const { data: userRes } = await sb.auth.getUser();
  if (!userRes.user) redirect("/login");

  const { data: items } = await sb
    .from("wardrobe_items")
    .select("id,image_url,category,color,description")
    .eq("user_id", userRes.user.id);

  return (
    <>
      <Nav loggedIn />
      <main className="main">
        <div className="container-narrow">
          <header
            style={{
              marginBottom: "var(--s-7)",
              textAlign: "center",
              paddingBottom: "var(--s-6)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span className="label" style={{ display: "block", marginBottom: "var(--s-3)" }}>
              N° 02 — Outfit suggestion
            </span>
            <h1 style={{ fontStyle: "italic", fontWeight: 300 }}>What should you wear?</h1>
            <p style={{ marginTop: "var(--s-3)", fontSize: "1.0625rem" }}>
              Tell me where you're going and what the weather's like.
            </p>
          </header>
          <SuggestForm items={items ?? []} />
        </div>
      </main>
    </>
  );
}