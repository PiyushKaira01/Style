import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const sb = createClient();
  const { data: userRes } = await sb.auth.getUser();
  if (!userRes.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // delete the row (cloudinary deletion skipped for simplicity in v1)
  const { error } = await sb
    .from("wardrobe_items")
    .delete()
    .eq("id", params.id)
    .eq("user_id", userRes.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
