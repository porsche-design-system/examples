import { describe, expect, it } from "vitest";
import {
  formatPriceTemplate,
  isReducedProduct,
} from "@/app/data/catalog-price";
import { createCatalogProduct } from "./fixtures/catalog-product";

describe("isReducedProduct", () => {
  it("returns true when priceOriginal is set", () => {
    const product = createCatalogProduct({
      priceOriginal: {
        amount: 100,
        currency: "USD",
        formatted: "$100.00",
      },
    });
    expect(isReducedProduct(product)).toBe(true);
    if (isReducedProduct(product)) {
      expect(product.priceOriginal.formatted).toBe("$100.00");
    }
  });

  it("returns false when priceOriginal is absent", () => {
    const product = createCatalogProduct();
    delete (product as { priceOriginal?: unknown }).priceOriginal;
    expect(isReducedProduct(product)).toBe(false);
  });
});

describe("formatPriceTemplate", () => {
  it("replaces multiple placeholders", () => {
    const result = formatPriceTemplate(
      "Was {originalPrice}, now {salePrice}",
      { originalPrice: "$100", salePrice: "$79" },
    );
    expect(result).toBe("Was $100, now $79");
  });

  it("leaves unknown placeholders unchanged", () => {
    const result = formatPriceTemplate("Price {amount}", {});
    expect(result).toBe("Price {amount}");
  });
});
