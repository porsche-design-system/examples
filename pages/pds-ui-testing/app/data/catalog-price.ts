import type { CatalogProduct } from "@/app/data/get-catalog";

export function isReducedProduct(
  product: CatalogProduct,
): product is CatalogProduct & {
  priceOriginal: NonNullable<CatalogProduct["priceOriginal"]>;
} {
  return product.priceOriginal !== undefined;
}

export function formatPriceTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, value),
    template,
  );
}
