/** Canonical URL slugs for lookbook / lifestyle product overviews (catalog `tags` use these values). */
export const lifestyleTagSlugs = [
  "timeless-enthusiast",
  "the-loyalist",
  "urbanist",
] as const;

export type LifestyleTagSlug = (typeof lifestyleTagSlugs)[number];

export function isLifestyleTagSlug(value: string): value is LifestyleTagSlug {
  return (lifestyleTagSlugs as readonly string[]).includes(value);
}
