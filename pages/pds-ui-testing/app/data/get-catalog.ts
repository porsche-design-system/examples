import { cache } from "react";
import type { Locale } from "@/app/i18n/config";
import type homeCatalogEn from "@/app/data/catalog/products.en.json";

export type HomeCatalog = typeof homeCatalogEn;
export type CatalogProduct = HomeCatalog["products"][number];

const catalogs: Record<Locale, () => Promise<HomeCatalog>> = {
  en: () => import("@/app/data/catalog/products.en.json").then((m) => m.default),
  de: () => import("@/app/data/catalog/products.de.json").then((m) => m.default),
};

/**
 * Homepage product catalog (locale-specific copy, shared asset paths).
 * Split from i18n messages so the catalog can grow without bloating UI strings.
 */
export const getHomeCatalog = cache(async (locale: Locale): Promise<HomeCatalog> => {
  return catalogs[locale]();
});
