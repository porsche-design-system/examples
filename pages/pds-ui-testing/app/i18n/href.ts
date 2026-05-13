import type { Locale } from "./config";
import type { CatalogFacetFilter } from "@/app/data/get-catalog";

function normalizeBasePath(): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return base.endsWith("/") && base.length > 1 ? base.slice(0, -1) : base;
}

/**
 * Absolute app path (must start with `/`). Prepends `NEXT_PUBLIC_BASE_PATH` when set.
 *
 * Use for **routes** and for **`public/` assets** referenced from raw `<img src>` (or
 * PDS slots). Do **not** use `./` for public files on locale routes (`/en/…`): the
 * browser resolves `./` against the **document URL**, so `./hero.jpg` becomes
 * `/en/hero.jpg` (404). Prefer `appHref('/hero.jpg')` instead of relying on `<base>`.
 */
export function appHref(path: string): string {
  const normalizedBase = normalizeBasePath();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function localeHomeHref(locale: Locale): string {
  return appHref(`/${locale}/`);
}

/** Full product catalog index (`/[locale]/products/`). */
export function productsIndexHref(locale: Locale): string {
  return appHref(`/${locale}/products/`);
}

/** Query flag on `productsIndexHref` to show only session-saved favorites (`?favorites=1`). */
export const PRODUCTS_FAVORITES_QUERY = "favorites";
export const PRODUCTS_FAVORITES_VALUE = "1";

/** Full product catalog index filtered to favorited products (session). */
export function productsFavoritesHref(locale: Locale): string {
  const base = productsIndexHref(locale);
  const params = new URLSearchParams();
  params.set(PRODUCTS_FAVORITES_QUERY, PRODUCTS_FAVORITES_VALUE);
  return `${base}?${params.toString()}`;
}

export function productDetailHref(locale: Locale, slug: string): string {
  return appHref(`/${locale}/products/${slug}/`);
}

export function productsFilterHref(
  locale: Locale,
  filter: CatalogFacetFilter,
): string {
  const params = new URLSearchParams();
  if (filter.audiences?.length) params.set("audience", filter.audiences.join(","));
  if (filter.categories?.length) params.set("category", filter.categories.join(","));
  if (filter.collections?.length) {
    params.set("collection", filter.collections.join(","));
  }
  if (filter.flags?.length) params.set("flag", filter.flags.join(","));
  if (filter.tags?.length) params.set("tag", filter.tags.join(","));
  const query = params.toString();
  return `${productsIndexHref(locale)}${query ? `?${query}` : ""}`;
}
