import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 120;

const HF_MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = (await req.json()) as { prompt?: string };
    if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

    const sb = createClient();
    const { data: userRes } = await sb.auth.getUser();
    if (!userRes.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Expand the user's short prompt into a fashion-photography-friendly version
    const expanded = `${prompt}, fashion photography, full body outfit shot, clean studio background, soft natural lighting, high detail, photorealistic`;

    // Call Hugging Face inference. Use "warmed-up" model endpoint.
    const hfRes = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: expanded,
          parameters: { num_inference_steps: 25, guidance_scale: 7.5 },
        }),
      },
    );

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      // Common case: model is loading
      if (hfRes.status === 503) {
        return NextResponse.json(
          { error: "Image model is warming up, please try again in 30 seconds." },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: `HF error: ${errText}` }, { status: 500 });
    }

    const imageBuffer = Buffer.from(await hfRes.arrayBuffer());
    const base64 = imageBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    // Upload to Cloudinary so we have a permanent URL
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "stylesense/generated";

    const crypto = await import("node:crypto");
    const signature = crypto
      .createHash("sha1")
      .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex");

    const cloudForm = new URLSearchParams();
    cloudForm.append("file", dataUrl);
    cloudForm.append("api_key", apiKey);
    cloudForm.append("timestamp", String(timestamp));
    cloudForm.append("folder", folder);
    cloudForm.append("signature", signature);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: cloudForm },
    );
    if (!cloudRes.ok) {
      // fallback: return data URL directly if Cloudinary chokes
      await sb.from("generated_outfits").insert({
        user_id: userRes.user.id,
        prompt,
        image_url: dataUrl,
      });
      return NextResponse.json({ url: dataUrl, prompt });
    }
    const cloudJson = await cloudRes.json();
    const url = cloudJson.secure_url as string;

    await sb.from("generated_outfits").insert({
      user_id: userRes.user.id,
      prompt,
      image_url: url,
    });

    return NextResponse.json({ url, prompt });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}