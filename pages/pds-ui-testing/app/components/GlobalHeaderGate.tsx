"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import { GlobalHeader } from "./GlobalHeader";

type Props = {
  dictionary: Dictionary;
  locale: Locale;
};

/** Home is the `[locale]` index route (no further path segments). */
export function GlobalHeaderGate({ dictionary, locale }: Props) {
  const segments = useSelectedLayoutSegments();
  const heroOverlay = segments.length === 0;

  return (
    <GlobalHeader
      dictionary={dictionary}
      heroOverlay={heroOverlay}
      locale={locale}
    />
  );
}
