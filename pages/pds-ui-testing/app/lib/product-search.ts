import type { CatalogProduct } from "@/app/data/get-catalog";

export const PRODUCT_SEARCH_MAX_RESULTS = 24;
export const PRODUCT_SEARCH_MIN_QUERY_LEN = 2;

export function searchInputValue(event: Event): string {
  const ce = event as Partial<CustomEvent<{ value?: unknown }>>;
  if (
    ce.detail != null &&
    typeof ce.detail === "object" &&
    "value" in ce.detail
  ) {
    const v = (ce.detail as { value?: unknown }).value;
    if (typeof v === "string") return v;
  }
  const target = event.target as unknown as { value?: unknown };
  if (target != null && typeof target.value === "string") return target.value;
  const current = event.currentTarget as unknown as { value?: unknown };
  if (current != null && typeof current.value === "string") {
    return current.value;
  }
  return "";
}

export function scoreProduct(product: CatalogProduct, needle: string): number {
  if (needle.length < PRODUCT_SEARCH_MIN_QUERY_LEN) return 0;
  const n = needle.toLowerCase();
  let score = 0;
  const bump = (text: string, weight: number) => {
    const h = text.toLowerCase();
    if (!h.includes(n)) return;
    score += weight;
    if (h.startsWith(n)) score += Math.ceil(weight / 3);
  };

  bump(product.name, 14);
  bump(product.teaser, 5);
  bump(product.description, 3);
  bump(product.sku, 12);
  bump(product.slug.replace(/-/g, " "), 6);
  for (const x of product.categories) bump(x, 3);
  for (const x of product.collections) bump(x, 3);
  for (const x of product.tags ?? []) bump(x, 2);
  for (const x of product.audiences ?? []) bump(x, 2);
  return score;
}

export function rankProducts(
  products: CatalogProduct[],
  q: string,
): CatalogProduct[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < PRODUCT_SEARCH_MIN_QUERY_LEN) return [];
  return [...products]
    .map((p) => ({ p, s: scoreProduct(p, needle) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, PRODUCT_SEARCH_MAX_RESULTS)
    .map(({ p }) => p);
}
