export type CategoryId =
  | "ai"
  | "search"
  | "learning"
  | "design"
  | "development"
  | "office"
  | "media"
  | "data"
  | "tools";

export type Category = {
  id: CategoryId;
  name: string;
  englishName: string;
  icon: string;
  description: string;
  accent: string;
};

export type Resource = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: CategoryId;
  tags: string[];
  featured: boolean;
  free: boolean;
  addedAt: string;
  initials: string;
  color: string;
};

export type FilterMode = "all" | "featured" | "free" | "new" | "favorites";
export type CategoryFilter = CategoryId | "all";
