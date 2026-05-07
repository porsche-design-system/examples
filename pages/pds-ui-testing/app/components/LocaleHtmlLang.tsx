"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { defaultLocale, isLocale, type Locale } from "@/app/i18n/config";

function localeFromPathname(pathname: string, basePath: string): Locale {
  const normalizedBase = basePath.replace(/\/$/, "");
  const rest =
    normalizedBase && pathname.startsWith(normalizedBase)
      ? pathname.slice(normalizedBase.length) || "/"
      : pathname;
  const first = rest.split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : defaultLocale;
}

export function LocaleHtmlLang() {
  const pathname = usePathname() ?? "/";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    document.documentElement.lang = localeFromPathname(pathname, basePath);
  }, [pathname, basePath]);

  return null;
}
