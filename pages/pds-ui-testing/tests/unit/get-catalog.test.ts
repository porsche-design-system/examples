import { describe, expect, it } from "vitest";
import {
  filterCatalogProducts,
  getCatalogProductBySlug,
  getRelatedCatalogProducts,
} from "@/app/data/get-catalog";
import { createCatalogProduct } from "./fixtures/catalog-product";

describe("filterCatalogProducts", () => {
  const menApparel = createCatalogProduct({
    id: "men-apparel",
    slug: "men-apparel",
    audiences: ["men"],
    categories: ["apparel"],
    tags: ["urbanist"],
    collections: ["porsche-design"],
    flags: ["featured"],
  });
  const womenAccessory = createCatalogProduct({
    id: "women-accessory",
    slug: "women-accessory",
    audiences: ["women"],
    categories: ["accessories"],
    tags: ["the-loyalist"],
    collections: ["porsche-originals"],
    flags: ["bestseller"],
  });
  const reducedProduct = createCatalogProduct({
    id: "reduced",
    slug: "reduced-item",
    flags: [],
    priceOriginal: {
      amount: 100,
      currency: "USD",
      formatted: "$100.00",
    },
  });
  const newRelease = createCatalogProduct({
    id: "new-release",
    slug: "new-release-item",
    flags: ["new-release"],
  });
  const products = [
    menApparel,
    womenAccessory,
    reducedProduct,
    newRelease,
  ];

  it("returns a copy of all products when no facets are set", () => {
    const result = filterCatalogProducts(products, {});
    expect(result).toEqual(products);
    expect(result).not.toBe(products);
  });

  it("filters by audience (OR within facet)", () => {
    const result = filterCatalogProducts(products, {
      audiences: ["men", "women"],
    });
    expect(result.map((p) => p.slug)).toEqual(["men-apparel", "women-accessory"]);
  });

  it("filters by category", () => {
    const result = filterCatalogProducts(products, {
      categories: ["apparel"],
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe("men-apparel");
  });

  it("filters by collection", () => {
    const result = filterCatalogProducts(products, {
      collections: ["porsche-design"],
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe("men-apparel");
  });

  it("filters by lifestyle tag", () => {
    const result = filterCatalogProducts(products, {
      tags: ["the-loyalist"],
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe("women-accessory");
  });

  it("combines facets with AND semantics", () => {
    const result = filterCatalogProducts(products, {
      audiences: ["men"],
      categories: ["accessories"],
    });
    expect(result).toHaveLength(0);
  });

  it("matches reduced flag via priceOriginal", () => {
    const result = filterCatalogProducts(products, {
      flags: ["reduced"],
    });
    expect(result.map((p) => p.slug)).toEqual(["reduced-item"]);
  });

  it("matches new-release flag via productHasNewReleaseFlag", () => {
    const result = filterCatalogProducts(products, {
      flags: ["new-release"],
    });
    expect(result.map((p) => p.slug)).toEqual(["new-release-item"]);
  });

  it("matches other merchandising flags on product.flags", () => {
    const result = filterCatalogProducts(products, {
      flags: ["bestseller"],
    });
    expect(result.map((p) => p.slug)).toEqual(["women-accessory"]);
  });
});

describe("getCatalogProductBySlug", () => {
  const products = [
    createCatalogProduct({ slug: "alpha" }),
    createCatalogProduct({ slug: "beta" }),
  ];

  it("returns the matching product", () => {
    expect(getCatalogProductBySlug(products, "beta")?.slug).toBe("beta");
  });

  it("returns undefined when slug is missing", () => {
    expect(getCatalogProductBySlug(products, "missing")).toBeUndefined();
  });
});

describe("getRelatedCatalogProducts", () => {
  const source = createCatalogProduct({
    id: "source",
    slug: "source",
    categories: ["apparel", "accessories"],
    tags: ["urbanist"],
    collections: ["porsche-design"],
  });
  const highOverlap = createCatalogProduct({
    id: "high",
    slug: "high-overlap",
    categories: ["apparel"],
    tags: ["urbanist"],
    collections: ["porsche-design"],
  });
  const lowOverlap = createCatalogProduct({
    id: "low",
    slug: "low-overlap",
    categories: ["accessories"],
    tags: ["timeless-enthusiast"],
    collections: ["porsche-originals"],
  });
  const noOverlap = createCatalogProduct({
    id: "none",
    slug: "no-overlap",
    categories: ["bags-luggage"],
    tags: ["the-loyalist"],
    collections: ["porsche-originals"],
  });

  it("excludes the source product", () => {
    const related = getRelatedCatalogProducts(
      [source, highOverlap],
      source,
    );
    expect(related.some((p) => p.id === "source")).toBe(false);
  });

  it("returns at most three products sorted by relevance score", () => {
    const products = [source, highOverlap, lowOverlap, noOverlap];
    const related = getRelatedCatalogProducts(products, source);
    expect(related).toHaveLength(2);
    expect(related[0]?.slug).toBe("high-overlap");
    expect(related[1]?.slug).toBe("low-overlap");
  });

  it("returns empty array when nothing shares facets", () => {
    const related = getRelatedCatalogProducts([source, noOverlap], source);
    expect(related).toEqual([]);
  });
});
