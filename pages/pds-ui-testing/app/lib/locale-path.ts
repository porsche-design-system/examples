import { isLocale, type Locale } from "@/app/i18n/config";

/**
 * Swaps the locale segment in a pathname, preserving route segments and trailing slash.
 * Strips and re-applies `basePath` when the pathname is served under a sub-path.
 */
export function replaceLocaleInPath(
  pathname: string,
  basePath: string,
  next: Locale,
): string {
  const normalizedBase = basePath.replace(/\/$/, "");
  const stripBase =
    normalizedBase && pathname.startsWith(normalizedBase)
      ? pathname.slice(normalizedBase.length) || "/"
      : pathname;

  const parts = stripBase.split("/").filter(Boolean);
  const first = parts[0];
  if (first !== undefined && isLocale(first)) {
    parts[0] = next;
  } else {
    parts.unshift(next);
  }

  let path = `/${parts.join("/")}`;
  if (!path.endsWith("/")) {
    path += "/";
  }
  return `${normalizedBase}${path}`;
}
