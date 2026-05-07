"use client";

import { PLinkPure } from "@porsche-design-system/components-react/ssr";
import { usePathname } from "next/navigation";
import {
  isLocale,
  locales,
  type Locale,
} from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";

type Props = {
  locale: Locale;
  labels: Dictionary["header"]["localeNames"];
  languageLabel: string;
};

function replaceLocale(pathname: string, basePath: string, next: Locale): string {
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

export function LanguageSwitcher({ locale, labels, languageLabel }: Props) {
  const pathname = usePathname() ?? "/";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <nav
      aria-label={languageLabel}
      className="flex flex-wrap items-center gap-static-xs"
    >
      {locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-static-xs">
          {index > 0 ? (
            <span aria-hidden className="text-contrast-medium">
              |
            </span>
          ) : null}
          <PLinkPure
            href={replaceLocale(pathname, basePath, loc)}
            aria-current={loc === locale ? "page" : undefined}
            size={{ base: "small", m: "medium" }}
          >
            {labels[loc]}
          </PLinkPure>
        </span>
      ))}
    </nav>
  );
}
