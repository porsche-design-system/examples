import { cache } from "react";
import type { Locale } from "./config";
import type dictionaryEn from "./messages/en.json";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./messages/en.json").then((m) => m.default),
  de: () => import("./messages/de.json").then((m) => m.default),
};

export type Dictionary = typeof dictionaryEn;

/**
 * Loads the dictionary for the given locale.
 *
 * Wrapped with React `cache()` so concurrent layouts/pages within the same
 * render share a single import instead of re-evaluating it.
 */
export const getDictionary = cache(
  async (locale: Locale): Promise<Dictionary> => {
    return dictionaries[locale]();
  },
);
