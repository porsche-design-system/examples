import type { Metadata } from "next";
import { HomeHero } from "@/app/components/home/HomeHero";
import { HomeLandingContent } from "@/app/components/home/HomeLandingContent";
import { filterCatalogProducts, getHomeCatalog } from "@/app/data/get-catalog";
import { isLocale, type Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";
import { productsIndexHref } from "@/app/i18n/href";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dictionary = await getDictionary(locale);
  return { title: dictionary.pages.home.title };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return null;
  const locale = raw as Locale;
  const [dictionary, catalog] = await Promise.all([
    getDictionary(locale),
    getHomeCatalog(locale),
  ]);
  const { home } = dictionary.pages;
  const trendingProducts = filterCatalogProducts(catalog.products, {
    flags: ["trending"],
  });

  return (
    <main
      className="relative z-0 grid-template gap-y-0"
      data-testid="main-content"
    >
      <HomeHero
        alt={home.teaserAlt}
        ctaLabel={home.heroCta}
        heading={home.heroHeading}
        modal={home.heroModal}
        productsHref={productsIndexHref(locale)}
        locale={locale}
      />
      <HomeLandingContent
        home={home}
        locale={locale}
        tilePricingCopy={dictionary.pages.productList.pricing}
        trendingProducts={trendingProducts}
      />
    </main>
  );
}
