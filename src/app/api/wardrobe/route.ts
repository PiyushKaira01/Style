import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const sb = createClient();
  const { data: userRes } = await sb.auth.getUser();
  if (!userRes.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await sb
    .from("wardrobe_items")
    .select("*")
    .eq("user_id", userRes.user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}
