import { describe, expect, it } from "vitest";
import {
  areSameFacetValues,
  buildCatalogFilterFromParams,
  formatCatalogCount,
  formatCatalogFilterLabel,
  getDisplayCatalogProducts,
  isFacetValueSelected,
  isFavoritesOnlyQuery,
  parseFacetValues,
} from "@/app/lib/catalog-query";
import { isAudienceSlug } from "@/app/data/catalog/taxonomy";
import {
  PRODUCTS_FAVORITES_QUERY,
  PRODUCTS_FAVORITES_VALUE,
} from "@/app/i18n/href";
import { createCatalogProduct } from "./fixtures/catalog-product";

describe("parseFacetValues", () => {
  it("returns empty array when param is missing", () => {
    const params = new URLSearchParams();
    expect(parseFacetValues(params, "audience", isAudienceSlug)).toEqual([]);
  });

  it("parses comma-separated valid values", () => {
    const params = new URLSearchParams({ audience: "men,women,invalid" });
    expect(parseFacetValues(params, "audience", isAudienceSlug)).toEqual([
      "men",
      "women",
    ]);
  });
});

describe("buildCatalogFilterFromParams", () => {
  it("builds empty filter from empty params", () => {
    expect(buildCatalogFilterFromParams(new URLSearchParams())).toEqual({
      audiences: [],
      categories: [],
      collections: [],
      flags: [],
      tags: [],
    });
  });

  it("maps legacy ?reduced=1 to reduced flag", () => {
    const filter = buildCatalogFilterFromParams(
      new URLSearchParams({ reduced: "1" }),
    );
    expect(filter.flags).toEqual(["reduced"]);
  });

  it("does not duplicate reduced when already in flag param", () => {
    const filter = buildCatalogFilterFromParams(
      new URLSearchParams({ reduced: "1", flag: "reduced" }),
    );
    expect(filter.flags).toEqual(["reduced"]);
  });

  it("parses all facet query keys", () => {
    const filter = buildCatalogFilterFromParams(
      new URLSearchParams({
        audience: "men",
        category: "apparel",
        collection: "porsche-design",
        flag: "new-release",
        tag: "urbanist",
      }),
    );
    expect(filter).toEqual({
      audiences: ["men"],
      categories: ["apparel"],
      collections: ["porsche-design"],
      flags: ["new-release"],
      tags: ["urbanist"],
    });
  });
});

describe("isFavoritesOnlyQuery", () => {
  it("returns true for favorites=1", () => {
    const params = new URLSearchParams({
      [PRODUCTS_FAVORITES_QUERY]: PRODUCTS_FAVORITES_VALUE,
    });
    expect(isFavoritesOnlyQuery(params)).toBe(true);
  });

  it("returns false otherwise", () => {
    expect(isFavoritesOnlyQuery(new URLSearchParams())).toBe(false);
  });
});

describe("facet selection helpers", () => {
  it("isFacetValueSelected checks membership", () => {
    expect(isFacetValueSelected(["men"], "men")).toBe(true);
    expect(isFacetValueSelected(["men"], "women")).toBe(false);
    expect(isFacetValueSelected(undefined, "men")).toBe(false);
  });

  it("areSameFacetValues compares sets regardless of order", () => {
    expect(areSameFacetValues(["a", "b"], ["b", "a"])).toBe(true);
    expect(areSameFacetValues(["a"], ["a", "b"])).toBe(false);
    expect(areSameFacetValues(undefined, [])).toBe(true);
  });

  it("formatCatalogCount substitutes count", () => {
    expect(formatCatalogCount("{count} products", 12)).toBe("12 products");
  });

  it("formatCatalogFilterLabel substitutes filter label", () => {
    expect(formatCatalogFilterLabel("Remove {filter}", "Men")).toBe(
      "Remove Men",
    );
  });
});

describe("getDisplayCatalogProducts", () => {
  const products = [
    createCatalogProduct({
      slug: "cheap",
      name: "Zebra Bag",
      audiences: ["men"],
      price: { amount: 10, currency: "USD", formatted: "$10" },
    }),
    createCatalogProduct({
      slug: "expensive",
      name: "Alpha Jacket",
      audiences: ["women"],
      price: { amount: 200, currency: "USD", formatted: "$200" },
    }),
    createCatalogProduct({
      slug: "men-only",
      name: "Men Cap",
      audiences: ["men"],
      price: { amount: 50, currency: "USD", formatted: "$50" },
    }),
  ];

  it("applies filter, sort, and favorites-only narrowing", () => {
    const params = new URLSearchParams({
      audience: "men",
      sort: "price-asc",
      [PRODUCTS_FAVORITES_QUERY]: PRODUCTS_FAVORITES_VALUE,
    });
    const display = getDisplayCatalogProducts(products, params, {
      favoritesOnly: true,
      isFavorite: (slug) => slug === "cheap",
    });
    expect(display.map((p) => p.slug)).toEqual(["cheap"]);
  });

  it("sorts by name when sort=name-asc", () => {
    const params = new URLSearchParams({ sort: "name-asc" });
    const display = getDisplayCatalogProducts(products, params, {
      favoritesOnly: false,
      isFavorite: () => false,
    });
    expect(display.map((p) => p.slug)).toEqual([
      "expensive",
      "men-only",
      "cheap",
    ]);
  });
});
