import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { groq } from "@/lib/grog/client";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { occasion, weather } = (await req.json()) as {
      occasion?: string;
      weather?: string;
    };
    if (!occasion) return NextResponse.json({ error: "occasion is required" }, { status: 400 });

    const sb = createClient();
    const { data: userRes } = await sb.auth.getUser();
    if (!userRes.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: items } = await sb
      .from("wardrobe_items")
      .select("id,category,color,season,style,description")
      .eq("user_id", userRes.user.id);

    if (!items || items.length === 0) {
      return NextResponse.json({
        reasoning:
          "Your wardrobe is empty. Upload some clothes first, then I can suggest outfits.",
        itemIds: [],
      });
    }

    // ask the model to pick items and explain
    const completion = await groq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a personal stylist. Pick outfit items from the user's wardrobe JSON. " +
            "Return JSON with keys: reasoning (string, 2-4 sentences explaining the outfit), " +
            "item_ids (array of ids from input). " +
            "Try to include a top AND a bottom (or dress), plus optional outerwear/shoes/accessory. " +
            "Consider the occasion, weather, season, color harmony, and style cohesion. " +
            "Only use item IDs that exist in the input. Respond with ONLY valid JSON.",
        },
        {
          role: "user",
          content: JSON.stringify({
            occasion,
            weather: weather || "not specified",
            wardrobe: items,
          }),
        },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: { reasoning?: string; item_ids?: string[] } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { reasoning: raw };
    }

    // validate that ids actually exist (don't trust the model to fabricate)
    const validIds = new Set(items.map((i) => i.id));
    const itemIds = (parsed.item_ids ?? []).filter((id) => validIds.has(id));

    // save history
    await sb.from("outfit_suggestions").insert({
      user_id: userRes.user.id,
      occasion,
      weather: weather || null,
      item_ids: itemIds,
      ai_reasoning: parsed.reasoning ?? null,
    });

    return NextResponse.json({
      reasoning: parsed.reasoning ?? "Here's a suggestion from your wardrobe.",
      itemIds,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}