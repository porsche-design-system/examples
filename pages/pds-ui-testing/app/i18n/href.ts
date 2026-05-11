import type { Locale } from "./config";

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
