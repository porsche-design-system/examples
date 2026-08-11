import { describe, expect, it } from "vitest";
import {
  catalogSortKeys,
  getCatalogSortKey,
  isCatalogSortKey,
  sortCatalogProducts,
} from "@/app/lib/catalog-sort";
import { createCatalogProduct } from "./fixtures/catalog-product";

describe("catalog sort", () => {
  const products = [
    createCatalogProduct({
      slug: "b",
      name: "Bravo",
      price: { amount: 50, currency: "USD", formatted: "$50" },
    }),
    createCatalogProduct({
      slug: "a",
      name: "Alpha",
      price: { amount: 10, currency: "USD", formatted: "$10" },
    }),
    createCatalogProduct({
      slug: "c",
      name: "Charlie",
      price: { amount: 100, currency: "USD", formatted: "$100" },
    }),
  ];

  it("exposes known sort keys", () => {
    expect(catalogSortKeys).toContain("price-asc");
    expect(catalogSortKeys).toContain("name-asc");
  });

  it("isCatalogSortKey validates sort param", () => {
    expect(isCatalogSortKey("price-desc")).toBe(true);
    expect(isCatalogSortKey("invalid")).toBe(false);
    expect(isCatalogSortKey(null)).toBe(false);
  });

  it("getCatalogSortKey defaults to recommended", () => {
    expect(getCatalogSortKey(new URLSearchParams())).toBe("recommended");
    expect(getCatalogSortKey(new URLSearchParams({ sort: "nope" }))).toBe(
      "recommended",
    );
    expect(getCatalogSortKey(new URLSearchParams({ sort: "price-asc" }))).toBe(
      "price-asc",
    );
  });

  it("sortCatalogProducts sorts by price ascending", () => {
    const sorted = sortCatalogProducts(products, "price-asc");
    expect(sorted.map((p) => p.slug)).toEqual(["a", "b", "c"]);
  });

  it("sortCatalogProducts sorts by price descending", () => {
    const sorted = sortCatalogProducts(products, "price-desc");
    expect(sorted.map((p) => p.slug)).toEqual(["c", "b", "a"]);
  });

  it("sortCatalogProducts sorts by name ascending", () => {
    const sorted = sortCatalogProducts(products, "name-asc");
    expect(sorted.map((p) => p.slug)).toEqual(["a", "b", "c"]);
  });

  it("sortCatalogProducts preserves order for recommended", () => {
    const sorted = sortCatalogProducts(products, "recommended");
    expect(sorted.map((p) => p.slug)).toEqual(["b", "a", "c"]);
  });

  it("does not mutate the input array", () => {
    const copy = [...products];
    sortCatalogProducts(products, "price-asc");
    expect(products.map((p) => p.slug)).toEqual(copy.map((p) => p.slug));
  });
});
