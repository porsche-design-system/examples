const STORAGE_KEY = "pds-ui-testing:product-favorite-slugs";

export function readFavoriteProductSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function writeFavoriteProductSlugs(slugs: readonly string[]): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(slugs)]));
  } catch {
    // private mode / quota
  }
}
