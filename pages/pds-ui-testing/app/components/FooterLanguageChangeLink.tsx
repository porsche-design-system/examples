"use client";

import { PLinkPure } from "@porsche-design-system/components-react/ssr";
import { usePathname } from "next/navigation";
import { isLocale, locales, type Locale } from "@/app/i18n/config";

type Props = {
  locale: Locale;
  regionChange: string;
  ariaLabelToDe: string;
  ariaLabelToEn: string;
};

function replaceLocale(
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

export function FooterLanguageChangeLink({
  locale,
  regionChange,
  ariaLabelToDe,
  ariaLabelToEn,
}: Props) {
  const pathname = usePathname() ?? "/";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const nextLocale = locales.find((l) => l !== locale) ?? "en";
  const href = replaceLocale(pathname, basePath, nextLocale);
  const ariaLabel = nextLocale === "de" ? ariaLabelToDe : ariaLabelToEn;

  return (
    <PLinkPure
      aria={{ "aria-label": ariaLabel }}
      href={href}
      icon="none"
      underline={true}
    >
      {regionChange}
    </PLinkPure>
  );
}
