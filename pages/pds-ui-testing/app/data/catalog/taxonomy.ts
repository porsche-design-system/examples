export const audienceSlugs = ["men", "women", "kids", "unisex"] as const;
export const categorySlugs = ["apparel", "accessories", "model-cars"] as const;
export const collectionSlugs = ["porsche-originals", "porsche-design"] as const;
export const merchandisingFlagSlugs = [
  "new-release",
  "bestseller",
  "limited-edition",
  "featured",
  "trending",
] as const;
export const lifestyleTagSlugs = [
  "timeless-enthusiast",
  "the-loyalist",
  "urbanist",
] as const;

export const catalogFacetKeys = [
  "audience",
  "category",
  "collection",
  "flag",
  "tag",
] as const;

export type AudienceSlug = (typeof audienceSlugs)[number];
export type CategorySlug = (typeof categorySlugs)[number];
export type CollectionSlug = (typeof collectionSlugs)[number];
export type MerchandisingFlagSlug = (typeof merchandisingFlagSlugs)[number];
export type LifestyleTagSlug = (typeof lifestyleTagSlugs)[number];
export type CatalogFacetKey = (typeof catalogFacetKeys)[number];

function includesValue<const T extends readonly string[]>(
  values: T,
  value: string,
): value is T[number] {
  return values.includes(value);
}

export function isAudienceSlug(value: string): value is AudienceSlug {
  return includesValue(audienceSlugs, value);
}

export function isCategorySlug(value: string): value is CategorySlug {
  return includesValue(categorySlugs, value);
}

export function isCollectionSlug(value: string): value is CollectionSlug {
  return includesValue(collectionSlugs, value);
}

export function isMerchandisingFlagSlug(
  value: string,
): value is MerchandisingFlagSlug {
  return includesValue(merchandisingFlagSlugs, value);
}

export function isLifestyleTagSlug(value: string): value is LifestyleTagSlug {
  return includesValue(lifestyleTagSlugs, value);
}
