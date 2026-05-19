import { describe, expect, it } from "vitest";
import { productHasNewReleaseFlag } from "@/app/data/catalog-product-flags";
import { createCatalogProduct } from "./fixtures/catalog-product";

describe("productHasNewReleaseFlag", () => {
  it("returns true when new-release is in flags", () => {
    const product = createCatalogProduct({ flags: ["new-release", "trending"] });
    expect(productHasNewReleaseFlag(product)).toBe(true);
  });

  it("returns false when new-release is absent", () => {
    const product = createCatalogProduct({ flags: ["featured"] });
    expect(productHasNewReleaseFlag(product)).toBe(false);
  });
});
