import {
  type CatalogFacetFilter,
  type CatalogProduct,
  filterCatalogProducts,
} from "@/app/data/get-catalog";
import {
  isAudienceSlug,
  isCategorySlug,
  isCollectionSlug,
  isLifestyleTagSlug,
  isMerchandisingFlagSlug,
} from "@/app/data/catalog/taxonomy";
import {
  PRODUCTS_FAVORITES_QUERY,
  PRODUCTS_FAVORITES_VALUE,
} from "@/app/i18n/href";
import {
  type CatalogSortKey,
  getCatalogSortKey,
  sortCatalogProducts,
} from "@/app/lib/catalog-sort";

export function parseFacetValues<T extends string>(
  searchParams: URLSearchParams,
  param: string,
  isValid: (value: string) => value is T,
): T[] {
  const raw = searchParams.get(param);
  if (!raw) return [];
  return raw.split(",").filter(isValid);
}

export function buildCatalogFilterFromParams(
  searchParams: URLSearchParams,
): CatalogFacetFilter {
  const flags = parseFacetValues(searchParams, "flag", isMerchandisingFlagSlug);
  // Legacy share links: `?reduced=1` maps to the Highlights flag `reduced`.
  if (searchParams.get("reduced") === "1" && !flags.includes("reduced")) {
    flags.push("reduced");
  }

  return {
    audiences: parseFacetValues(searchParams, "audience", isAudienceSlug),
    categories: parseFacetValues(searchParams, "category", isCategorySlug),
    collections: parseFacetValues(searchParams, "collection", isCollectionSlug),
    flags,
    tags: parseFacetValues(searchParams, "tag", isLifestyleTagSlug),
  };
}

export function isFavoritesOnlyQuery(searchParams: URLSearchParams): boolean {
  return (
    searchParams.get(PRODUCTS_FAVORITES_QUERY) === PRODUCTS_FAVORITES_VALUE
  );
}

export function isFacetValueSelected<T extends string>(
  selected: readonly T[] | undefined,
  value: T,
): boolean {
  return selected?.includes(value) ?? false;
}

export function formatCatalogCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

export function formatCatalogFilterLabel(
  template: string,
  filterLabel: string,
): string {
  return template.replace("{filter}", filterLabel);
}

export function areSameFacetValues<T extends string>(
  currentValues: readonly T[] | undefined,
  expectedValues: readonly T[] | undefined,
): boolean {
  const current = currentValues ?? [];
  const expected = expectedValues ?? [];
  return (
    current.length === expected.length &&
    expected.every((value) => current.includes(value))
  );
}

export type CatalogDisplayOptions = {
  favoritesOnly: boolean;
  isFavorite: (slug: string) => boolean;
};

/** Applies URL filter, sort, and optional favorites-only narrowing. */
export function getDisplayCatalogProducts(
  products: CatalogProduct[],
  searchParams: URLSearchParams,
  options: CatalogDisplayOptions,
): CatalogProduct[] {
  const filter = buildCatalogFilterFromParams(searchParams);
  const sortKey = getCatalogSortKey(searchParams);
  const filtered = filterCatalogProducts(products, filter);
  const sorted = sortCatalogProducts(filtered, sortKey);
  if (!options.favoritesOnly) return sorted;
  return sorted.filter((p) => options.isFavorite(p.slug));
}

export type { CatalogSortKey };
