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
    details: {
      description: {
        paragraphs: ["Extended test description."],
        bullets: ["Feature one", "Feature two"],
      },
      dimensionsAndWeight: {
        dimensions: "100 mm x 50 mm x 10 mm",
        weight: "50 g",
      },
      materialAndCare: {
        material: "Test material",
        careInstructions: "Test care instructions",
      },
      generalCharacteristics: [{ label: "Color", value: "Black" }],
    },
    ...overrides,
  } as CatalogProduct;
}
