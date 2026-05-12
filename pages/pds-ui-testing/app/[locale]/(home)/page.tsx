import type { Metadata } from "next";
import { HomeHero } from "@/app/components/HomeHero";
import { HomeLandingContent } from "@/app/components/HomeLandingContent";
import { filterCatalogProducts, getHomeCatalog } from "@/app/data/get-catalog";
import { isLocale, type Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

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
      />
      <HomeLandingContent
        home={home}
        locale={locale}
        products={trendingProducts}
      />
    </main>
  );
}
