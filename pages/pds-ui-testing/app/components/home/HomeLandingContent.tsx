import {
  PCarousel,
  PHeading,
  PLink,
  PLinkPure,
  PLinkTile,
  PAiTag,
  PTag,
  PText,
} from "@porsche-design-system/components-react/ssr";
import {
  FavoriteLinkTileProduct,
  type TilePricingCopy,
} from "@/app/components/favorites/FavoriteLinkTileProduct";
import type { CatalogProduct } from "@/app/data/get-catalog";
import {
  isLifestyleTagSlug,
  lifestyleTagSlugs,
} from "@/app/data/catalog/taxonomy";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import {
  appHref,
  productsFilterHref,
  productsIndexHref,
} from "@/app/i18n/href";

type HomeCopy = Dictionary["pages"]["home"];

/** Paths under `public/` (leading `/`); pass through {@link appHref} so `basePath` works. */
const LIFESTYLE_IMAGE_PATHS = [
  "/home-lifestyle-timeless.jpg",
  "/home-lifestyle-loyalist.jpg",
  "/home-lifestyle-urbanist.jpg",
] as const;

const FEATURE_IMAGE_PATHS = [
  "/home-feature-roadster.png",
  "/home-feature-travel-transport.jpg",
] as const;

type Props = {
  home: HomeCopy;
  locale: Locale;
  tilePricingCopy: TilePricingCopy;
  trendingProducts: CatalogProduct[];
};

function lifestyleTileHref(locale: Locale, lifestyleTag: string): string {
  return isLifestyleTagSlug(lifestyleTag)
    ? productsFilterHref(locale, { tags: [lifestyleTag] })
    : productsIndexHref(locale);
}

function allLifestyleTagsHref(locale: Locale): string {
  return productsFilterHref(locale, { tags: [...lifestyleTagSlugs] });
}

function featureTileHref(locale: Locale, href: string, index: number): string {
  if (index === 0) {
    return productsFilterHref(locale, {
      categories: ["bags-luggage"],
      flags: ["featured"],
    });
  }
  if (index === 1) {
    return productsFilterHref(locale, { categories: ["travel-transport"] });
  }
  return href;
}

/**
 * Homepage sections from Figma landing frame (node 1:8387): intro, lifestyle tiles,
 * trending products, and large feature tiles — excluding header, hero, and footer.
 *
 * Lifestyle tiles use the Porsche Grid (`col-full` →
 * `col-basic` → `col-span-one-third`). Feature tiles use (`col-full` → `col-wide`
 * → `col-span-one-half`), per PDS Tailwind grid docs — not arbitrary `grid-cols-*`
 * counts.
 *
 * Lifestyle and feature rows use `PLinkTile` (description/label slots, built-in
 * gradient + chevron) with `PTag slot="header"` for badges on lifestyle tiles.
 * Plain `<img>` is the documented child pattern for the tile's default slot.
 * Image `src` uses `appHref('/file-in-public.jpg')` so requests are not resolved
 * relative to `/[locale]/` (which would 404 in DevTools even if a fallback showed a tile).
 */
export function HomeLandingContent({
  home,
  locale,
  tilePricingCopy,
  trendingProducts,
}: Props) {
  return (
    <>
      <section
        aria-labelledby="home-intro-heading"
        className="col-full grid grid-cols-subgrid"
      >
        <div className="col-wide flex flex-col gap-fluid-sm items-center mt-fluid-2xl">
          <h2 className="sr-only" id="home-intro-heading">
            {home.introHeading}
          </h2>
          <PTag compact variant="primary">
            {home.lookbookTag}
          </PTag>
          <PText className="max-w-[635px]" size="xl" align="center">
            {home.intro}
          </PText>
          <PLink
            href={allLifestyleTagsHref(locale)}
            variant="primary"
            className="mt-fluid-md"
          >
            {home.shopTheLook}
          </PLink>
        </div>
        <div className="col-basic grid grid-cols-subgrid gap-fluid-md mt-fluid-xl">
          {home.lifestyleTiles.map((tile, index) => (
            <PLinkTile
              align="bottom"
              aspectRatio="3/4"
              className="col-span-full md:col-span-one-third"
              compact
              description={tile.description}
              gradient
              href={lifestyleTileHref(locale, tile.lifestyleTag)}
              key={tile.lifestyleTag}
              label={tile.label}
              size="large"
            >
              {tile.tagLabel ? (
                <PTag compact slot="header" variant="success">
                  {tile.tagLabel}
                </PTag>
              ) : (
                <PAiTag
                  slot="header"
                  locale={locale === "en" ? "en_US" : "de_DE"}
                />
              )}
              {/* biome-ignore lint/performance/noImgElement: PLinkTile's default slot expects a bare <img>; next/image's wrapper breaks the slot. */}
              <img
                alt=""
                src={appHref(
                  LIFESTYLE_IMAGE_PATHS[index] ?? LIFESTYLE_IMAGE_PATHS[0],
                )}
              />
            </PLinkTile>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="home-trending-heading"
        className="col-full grid grid-cols-subgrid"
        id="products"
      >
        <div className="col-wide flex flex-col items-center text-center mt-fluid-2xl">
          <PHeading id="home-trending-heading" size="3xl" tag="h2">
            {home.trendingHeading}
          </PHeading>
          <PLinkPure
            href={productsIndexHref(locale)}
            icon="arrow-right"
            underline={true}
            className="mt-fluid-sm"
          >
            {home.trendingLinkLabel}
          </PLinkPure>
        </div>
        <div className="col-full mt-fluid-lg">
          <PCarousel
            intl={{
              next: home.trendingCarouselNext,
              prev: home.trendingCarouselPrevious,
            }}
            slidesPerPage={{ base: 1, s: 2, m: 3 }}
            width="basic"
            pagination
            aria={{
              "aria-label": "Trending Products",
            }}
          >
            {trendingProducts.slice(0, 5).map((product) => (
              <FavoriteLinkTileProduct
                key={product.id}
                locale={locale}
                pricingCopy={tilePricingCopy}
                product={product}
              />
            ))}
          </PCarousel>
        </div>
      </section>

      <section
        aria-labelledby="home-feature-heading"
        className="col-full grid grid-cols-subgrid mt-fluid-2xl"
      >
        <div className="col-wide flex flex-col items-center text-center">
          <PHeading id="home-feature-heading" size="3xl" tag="h2">
            {home.featureHeading}
          </PHeading>
        </div>
        <div className="col-wide grid grid-cols-subgrid gap-fluid-md mt-fluid-lg">
          {home.featureTiles.map((tile, index) => (
            <PLinkTile
              align="top"
              aspectRatio="3/4"
              className="col-span-full md:col-span-one-half"
              description={tile.description}
              gradient
              compact
              href={featureTileHref(locale, tile.href, index)}
              key={tile.href}
              label={tile.label}
              size="large"
            >
              {/* biome-ignore lint/performance/noImgElement: PLinkTile's default slot expects a bare <img>; next/image's wrapper breaks the slot. */}
              <img
                alt=""
                src={appHref(
                  FEATURE_IMAGE_PATHS[index] ?? FEATURE_IMAGE_PATHS[0],
                )}
              />
            </PLinkTile>
          ))}
        </div>
      </section>
    </>
  );
}
