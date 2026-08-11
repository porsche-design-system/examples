import type { CatalogProduct } from "@/app/data/get-catalog";

export const catalogSortKeys = [
  "recommended",
  "price-asc",
  "price-desc",
  "name-asc",
] as const;

export type CatalogSortKey = (typeof catalogSortKeys)[number];

export function isCatalogSortKey(value: string | null): value is CatalogSortKey {
  return catalogSortKeys.includes(value as CatalogSortKey);
}

export function getCatalogSortKey(searchParams: URLSearchParams): CatalogSortKey {
  const sort = searchParams.get("sort");
  return isCatalogSortKey(sort) ? sort : "recommended";
}

export function sortCatalogProducts(
  products: CatalogProduct[],
  sortKey: CatalogSortKey,
): CatalogProduct[] {
  const sortedProducts = [...products];

  switch (sortKey) {
    case "price-asc":
      return sortedProducts.sort((a, b) => a.price.amount - b.price.amount);
    case "price-desc":
      return sortedProducts.sort((a, b) => b.price.amount - a.price.amount);
    case "name-asc":
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case "recommended":
      return sortedProducts;
  }
}
