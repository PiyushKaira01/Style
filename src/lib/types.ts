// Shared types

export type WardrobeItem = {
  id: string;
  user_id: string;
  image_url: string;
  cloudinary_public_id: string | null;
  category: string | null;
  color: string | null;
  season: string | null;
  style: string | null;
  description: string | null;
  created_at: string;
};

export type OutfitSuggestion = {
  id: string;
  user_id: string;
  occasion: string;
  weather: string | null;
  item_ids: string[];
  ai_reasoning: string | null;
  created_at: string;
};

export type GeneratedOutfit = {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  created_at: string;
};
