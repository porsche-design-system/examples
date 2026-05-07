import type { Locale } from "./config";
import type dictionaryEn from "./messages/en.json";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./messages/en.json").then((m) => m.default),
  de: () => import("./messages/de.json").then((m) => m.default),
};

export type Dictionary = typeof dictionaryEn;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
