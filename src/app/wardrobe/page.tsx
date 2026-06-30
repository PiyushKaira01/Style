import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/Nav";
import WardrobeGallery from "./WardrobeGallery";
import UploadButton from "./UploadButton";

export default async function WardrobePage() {
  const sb = createClient();
  const { data: userRes } = await sb.auth.getUser();
  if (!userRes.user) redirect("/login");

  const { data: items } = await sb
    .from("wardrobe_items")
    .select("*")
    .eq("user_id", userRes.user.id)
    .order("created_at", { ascending: false });

  const count = items?.length ?? 0;

  return (
    <>
      <Nav loggedIn />
      <main className="main">
        <div className="container">
          <header
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "var(--s-4)",
              marginBottom: "var(--s-7)",
              paddingBottom: "var(--s-6)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div>
              <span className="label" style={{ display: "block", marginBottom: "var(--s-3)" }}>
                N° 01 — Your closet
              </span>
              <h1 style={{ fontStyle: "italic", fontWeight: 300 }}>Wardrobe</h1>
              <p style={{ marginTop: "var(--s-2)", fontSize: "0.875rem" }}>
                {count === 0
                  ? "Begin by adding your first piece."
                  : `${count} ${count === 1 ? "piece" : "pieces"} and counting.`}
              </p>
            </div>
            <UploadButton />
          </header>

          <WardrobeGallery initialItems={items ?? []} />
        </div>
      </main>
    </>
  );
}