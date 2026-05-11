import type { Locale } from "./config";

function normalizeBasePath(): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return base.endsWith("/") && base.length > 1 ? base.slice(0, -1) : base;
}

/** Path must start with `/` (e.g. `/en/company/glance/`). Respects `NEXT_PUBLIC_BASE_PATH`. */
export function appHref(path: string): string {
  const normalizedBase = normalizeBasePath();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function localeHomeHref(locale: Locale): string {
  return appHref(`/${locale}/`);
}
