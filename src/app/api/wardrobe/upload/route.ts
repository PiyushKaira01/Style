// Receives an image (file or base64 dataURL), uploads to Cloudinary,
// asks Groq (Llama 3.2 Vision) to tag it, saves metadata to Supabase.
import { NextRequest, NextResponse } from "next/server";
import { createClient as supabaseServer } from "@/lib/supabase/server";
import { groq } from "@/lib/grog/client";

export const runtime = "nodejs";
export const maxDuration = 60;

async function uploadToCloudinary(dataUrl: string): Promise<{ url: string; publicId: string }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "stylesense/wardrobe";

  const form = new URLSearchParams();
  form.append("file", dataUrl);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);

  // We use an unsigned upload-style approach but include the api_key.
  // For a small-group app we keep it simple. For production, prefer signed uploads.
  // Server-side we can use the signed upload directly.

  const crypto = await import("node:crypto");
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${await res.text()}`);
  const json = await res.json();
  return { url: json.secure_url as string, publicId: json.public_id as string };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dataUrl: string = body.image;
    if (!dataUrl || !dataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    const sb = supabaseServer();
    const { data: userRes } = await sb.auth.getUser();
    if (!userRes.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = userRes.user.id;

    // 1. upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(dataUrl);

    // 2. ask Groq to tag it (vision-capable Llama 3.2)
    const completion = await groq().chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Look at this clothing item and respond with ONLY valid JSON (no markdown, no prose) with these exact keys: " +
                '{"category": "one of [top, bottom, dress, outerwear, shoes, accessory]", ' +
                '"color": "main color, lowercase", ' +
                '"season": "one of [summer, winter, spring, fall, all-season]", ' +
                '"style": "one of [casual, formal, sporty, business, boho, streetwear]", ' +
                '"description": "10-word max description"}',
            },
            { type: "image_url", image_url: { url } },
          ],
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let tags: {
      category?: string;
      color?: string;
      season?: string;
      style?: string;
      description?: string;
    } = {};
    try {
      tags = JSON.parse(raw);
    } catch {
      tags = {};
    }

    // 3. save row
    const { data, error } = await sb
      .from("wardrobe_items")
      .insert({
        user_id: userId,
        image_url: url,
        cloudinary_public_id: publicId,
        category: tags.category ?? null,
        color: tags.color ?? null,
        season: tags.season ?? null,
        style: tags.style ?? null,
        description: tags.description ?? null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ item: data });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
