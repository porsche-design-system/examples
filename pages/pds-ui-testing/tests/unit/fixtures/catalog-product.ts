import type { CatalogProduct } from "@/app/data/get-catalog";

const defaultPrice = {
  amount: 50,
  currency: "USD",
  formatted: "$50.00",
} as const;

/** Minimal catalog product for unit tests; override fields as needed. */
export function createCatalogProduct(
  overrides: Partial<CatalogProduct> = {},
): CatalogProduct {
  return {
    id: "product-test",
    slug: "test-product",
    sku: "TEST-SKU",
    audiences: ["unisex"],
    tags: ["urbanist"],
    categories: ["accessories"],
    collections: ["porsche-originals"],
    flags: ["featured"],
    name: "Test Product",
    teaser: "Test teaser",
    description: "Test description",
    price: { ...defaultPrice },
    vatNote: "incl. VAT",
    images: [{ src: "/test.jpg", alt: "Test" }],
    ...overrides,
  };
}
