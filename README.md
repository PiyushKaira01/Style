# StyleSense

An AI-powered outfit assistant. Upload clothes to your wardrobe, get suggestions for occasions and weather, and generate outfit inspiration images.

## Features

- 👤 Email/password authentication (Supabase)
- 📸 Upload clothing photos — AI auto-tags each item with category, color, season, and style
- 👗 Get outfit suggestions from your wardrobe based on occasion + weather
- 🎨 Generate outfit inspiration images (text → image) using Hugging Face

## Free-tier stack

Everything runs on free tiers:
- **Next.js** frontend
- **Supabase** for auth and database (500MB free)
- **Cloudinary** for image storage (25GB free)
- **Groq** for AI text reasoning (free Llama 3.3)
- **Hugging Face** for AI image generation (free inference)
- **Vercel** for hosting (free)

## Running locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Make sure `.env.local` has all 8 keys (see `.env.example`).
3. Set up the database tables by running the SQL in `supabase-setup.sql` in your Supabase SQL Editor.
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000

## Deploying to Vercel (free)

1. Push this folder to a GitHub repo (or use Vercel's "import project" flow).
2. On vercel.com → New Project → Import your repo.
3. Add all 8 environment variables from your `.env.local` into the Vercel project settings.
4. Click Deploy. Your site will be live at `https://stylesense-xxx.vercel.app` in ~2 minutes.

## Database setup

Run this once in your Supabase SQL Editor:

```sql
create table wardrobe_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  image_url text not null,
  cloudinary_public_id text,
  category text,
  color text,
  season text,
  style text,
  description text,
  created_at timestamp default now()
);

create table outfit_suggestions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  occasion text,
  weather text,
  item_ids uuid[],
  ai_reasoning text,
  created_at timestamp default now()
);

create table generated_outfits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  prompt text,
  image_url text,
  created_at timestamp default now()
);

alter table wardrobe_items enable row level security;
alter table outfit_suggestions enable row level security;
alter table generated_outfits enable row level security;

create policy "Users see own wardrobe" on wardrobe_items for select using (auth.uid() = user_id);
create policy "Users insert own wardrobe" on wardrobe_items for insert with check (auth.uid() = user_id);
create policy "Users delete own wardrobe" on wardrobe_items for delete using (auth.uid() = user_id);

create policy "Users see own suggestions" on outfit_suggestions for select using (auth.uid() = user_id);
create policy "Users insert own suggestions" on outfit_suggestions for insert with check (auth.uid() = user_id);

create policy "Users see own generated" on generated_outfits for select using (auth.uid() = user_id);
create policy "Users insert own generated" on generated_outfits for insert with check (auth.uid() = user_id);
```