import { describe, expect, it } from "vitest";
import {
  PRODUCT_SEARCH_MAX_RESULTS,
  PRODUCT_SEARCH_MIN_QUERY_LEN,
  rankProducts,
  scoreProduct,
  searchInputValue,
} from "@/app/lib/product-search";
import { createCatalogProduct } from "./fixtures/catalog-product";

describe("searchInputValue", () => {
  it("reads value from CustomEvent detail", () => {
    const event = new CustomEvent("change", { detail: { value: "porsche" } });
    expect(searchInputValue(event)).toBe("porsche");
  });

  it("reads value from event target", () => {
    const input = document.createElement("input");
    input.value = "cap";
    const event = { target: input, currentTarget: null } as unknown as Event;
    expect(searchInputValue(event)).toBe("cap");
  });

  it("returns empty string when no value is found", () => {
    expect(searchInputValue(new Event("input"))).toBe("");
  });
});

describe("scoreProduct and rankProducts", () => {
  const products = [
    createCatalogProduct({
      slug: "porsche-design-baseball-cap",
      name: "Porsche Design Baseball Cap",
      sku: "CAP-001",
      teaser: "City cap",
      description: "Everyday wear",
      categories: ["apparel"],
    }),
    createCatalogProduct({
      slug: "leather-keychain",
      name: "Leather Keychain",
      sku: "KEY-999",
      teaser: "Compact accessory",
    }),
  ];

  it("returns zero score for queries shorter than minimum length", () => {
    expect(scoreProduct(products[0]!, "p")).toBe(0);
    expect(PRODUCT_SEARCH_MIN_QUERY_LEN).toBe(2);
  });

  it("scores name matches higher than teaser-only matches", () => {
    const nameScore = scoreProduct(products[0]!, "porsche");
    const teaserOnly = createCatalogProduct({
      slug: "other",
      name: "Unrelated",
      teaser: "porsche inspired",
    });
    const teaserScore = scoreProduct(teaserOnly, "porsche");
    expect(nameScore).toBeGreaterThan(teaserScore);
  });

  it("adds prefix bonus when text starts with needle", () => {
    const prefixScore = scoreProduct(products[0]!, "porsche");
    const containsScore = scoreProduct(
      createCatalogProduct({
        slug: "x",
        name: "My Porsche Cap",
      }),
      "porsche",
    );
    expect(prefixScore).toBeGreaterThan(containsScore);
  });

  it("rankProducts returns empty for short queries", () => {
    expect(rankProducts(products, "p")).toEqual([]);
  });

  it("rankProducts returns matches sorted by score", () => {
    const ranked = rankProducts(products, "cap");
    expect(ranked[0]?.slug).toBe("porsche-design-baseball-cap");
  });

  it("rankProducts caps results at PRODUCT_SEARCH_MAX_RESULTS", () => {
    const many = Array.from({ length: 30 }, (_, i) =>
      createCatalogProduct({ slug: `item-${i}`, name: `Porsche Item ${i}` }),
    );
    expect(rankProducts(many, "porsche")).toHaveLength(
      PRODUCT_SEARCH_MAX_RESULTS,
    );
  });

  it("rankProducts trims query whitespace", () => {
    expect(rankProducts(products, "  cap  ").length).toBeGreaterThan(0);
  });
});
