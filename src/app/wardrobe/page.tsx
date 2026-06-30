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
            }}
          >
            <div>
              <span className="pill" style={{ marginBottom: "var(--s-3)" }}>Your closet</span>
              <h1 style={{ fontSize: "2.75rem", marginTop: "var(--s-3)" }}>Wardrobe</h1>
              <p style={{ marginTop: "var(--s-2)", fontSize: "1rem" }}>
                {count === 0
                  ? "Start by adding your first item."
                  : `${count} ${count === 1 ? "item" : "items"} and counting.`}
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