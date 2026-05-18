import type { CatalogProduct } from "@/app/data/get-catalog";

/** Product is a new release (tile tag and Highlights filter). */
export function productHasNewReleaseFlag(product: CatalogProduct): boolean {
  return product.flags.includes("new-release");
}
