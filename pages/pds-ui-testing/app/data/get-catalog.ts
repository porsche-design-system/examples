import { cache } from "react";
import type { Locale } from "@/app/i18n/config";
import type homeCatalogEn from "@/app/data/catalog/products.en.json";
import type { LifestyleTagSlug } from "@/app/i18n/lifestyle-tags";

export type HomeCatalog = typeof homeCatalogEn;
export type CatalogProduct = HomeCatalog["products"][number];

/**
 * Faceted filtering for the static JSON catalog.
 *
 * - **`tags`**: lifestyle / lookbook dimensions (curated routes like `/lifestyle/[tag]`).
 * - **`categories`**: merchandising dimensions (department, product type, …). Add
 *   more slugs in JSON and combine facets here; for static export, prefer **dedicated
 *   routes** per facet (or nested segments) over query strings so paths are
 *   prerenderable without a server.
 *
 * Next evolution: optional `collections: string[]` or a single `productSlug` for
 * `/products/[slug]` detail pages; keep listing filters as pure functions over
 * `getHomeCatalog()` output.
 */
export type CatalogFacetFilter = {
  lifestyleTag?: LifestyleTagSlug;
  /** Product must include every category slug. */
  categoriesMatchAll?: string[];
  /** Product must include at least one category slug. */
  categoriesMatchAny?: string[];
};

export function filterCatalogProducts(
  products: CatalogProduct[],
  filter: CatalogFacetFilter,
): CatalogProduct[] {
  const hasFacet =
    filter.lifestyleTag !== undefined ||
    (filter.categoriesMatchAll?.length ?? 0) > 0 ||
    (filter.categoriesMatchAny?.length ?? 0) > 0;
  if (!hasFacet) return [...products];

  return products.filter((p) => {
    if (
      filter.lifestyleTag !== undefined &&
      !p.tags.includes(filter.lifestyleTag)
    ) {
      return false;
    }
    const cats = p.categories;
    const all = filter.categoriesMatchAll;
    if (all?.length && !all.every((c) => cats.includes(c))) return false;
    const any = filter.categoriesMatchAny;
    if (any?.length && !any.some((c) => cats.includes(c))) return false;
    return true;
  });
}

export function filterProductsByLifestyleTag(
  products: CatalogProduct[],
  tag: LifestyleTagSlug,
): CatalogProduct[] {
  return filterCatalogProducts(products, { lifestyleTag: tag });
}

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
