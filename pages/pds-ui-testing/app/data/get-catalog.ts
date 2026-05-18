import { cache } from "react";
import { isReducedProduct } from "@/app/data/catalog-price";
import { productHasNewReleaseFlag } from "@/app/data/catalog-product-flags";
import type { Locale } from "@/app/i18n/config";
import type homeCatalogEn from "@/app/data/catalog/products.en.json";
import type {
  AudienceSlug,
  CategorySlug,
  CollectionSlug,
  LifestyleTagSlug,
  MerchandisingFlagSlug,
} from "@/app/data/catalog/taxonomy";

export type HomeCatalog = typeof homeCatalogEn;
export type CatalogProduct = HomeCatalog["products"][number];

export type CatalogFacetFilter = {
  audiences?: AudienceSlug[];
  categories?: CategorySlug[];
  collections?: CollectionSlug[];
  flags?: MerchandisingFlagSlug[];
  tags?: LifestyleTagSlug[];
};

function hasAny<T extends string>(
  productValues: readonly T[],
  filterValues: readonly T[] | undefined,
): boolean {
  return filterValues === undefined || filterValues.length === 0
    ? true
    : filterValues.some((value) => productValues.includes(value));
}

function matchesMerchandisingFlags(
  product: CatalogProduct,
  filterFlags: readonly MerchandisingFlagSlug[] | undefined,
): boolean {
  if (!filterFlags || filterFlags.length === 0) return true;
  return filterFlags.some((flag) => {
    if (flag === "reduced") return isReducedProduct(product);
    if (flag === "new-release") return productHasNewReleaseFlag(product);
    return product.flags.includes(flag);
  });
}

export function filterCatalogProducts(
  products: CatalogProduct[],
  filter: CatalogFacetFilter,
): CatalogProduct[] {
  const hasFacet = Object.values(filter).some((value) => {
    const length = (value as readonly string[] | undefined)?.length ?? 0;
    return length > 0;
  });
  if (!hasFacet) return [...products];

  return products.filter((p) => {
    return (
      hasAny(p.audiences, filter.audiences) &&
      hasAny(p.categories, filter.categories) &&
      hasAny(p.collections, filter.collections) &&
      matchesMerchandisingFlags(p, filter.flags) &&
      hasAny(p.tags, filter.tags)
    );
  });
}

export function getCatalogProductBySlug(
  products: CatalogProduct[],
  slug: string,
): CatalogProduct | undefined {
  return products.find((product) => product.slug === slug);
}

export function getRelatedCatalogProducts(
  products: CatalogProduct[],
  product: CatalogProduct,
): CatalogProduct[] {
  return products
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      const score =
        candidate.categories.filter((category) =>
          product.categories.includes(category),
        ).length * 3 +
        candidate.tags.filter((tag) => product.tags.includes(tag)).length * 2 +
        candidate.collections.filter((collection) =>
          product.collections.includes(collection),
        ).length;
      return { product: candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ product }) => product);
}

const catalogs: Record<Locale, () => Promise<HomeCatalog>> = {
  en: () => import("@/app/data/catalog/products.en.json").then((m) => m.default),
  de: () => import("@/app/data/catalog/products.de.json").then((m) => m.default),
};

/**
 * Locale-specific shop catalog, split from i18n messages so product data can grow
 * without bloating UI copy.
 */
export const getHomeCatalog = cache(async (locale: Locale): Promise<HomeCatalog> => {
  return catalogs[locale]();
});
