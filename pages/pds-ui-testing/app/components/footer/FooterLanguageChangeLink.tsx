"use client";

import { PLinkPure } from "@porsche-design-system/components-react/ssr";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/app/i18n/config";
import { replaceLocaleInPath } from "@/app/lib/locale-path";

type Props = {
  locale: Locale;
  regionChange: string;
  ariaLabelToDe: string;
  ariaLabelToEn: string;
};

export function FooterLanguageChangeLink({
  locale,
  regionChange,
  ariaLabelToDe,
  ariaLabelToEn,
}: Props) {
  const pathname = usePathname() ?? "/";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const nextLocale = locales.find((l) => l !== locale) ?? "en";
  const href = replaceLocaleInPath(pathname, basePath, nextLocale);
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
