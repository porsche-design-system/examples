import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LifestyleProductOverview } from "@/app/components/LifestyleProductOverview";
import { filterCatalogProducts, getHomeCatalog } from "@/app/data/get-catalog";
import { isLocale, type Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";
import {
  isLifestyleTagSlug,
  lifestyleTagSlugs,
  type LifestyleTagSlug,
} from "@/app/i18n/lifestyle-tags";

export function generateStaticParams() {
  return lifestyleTagSlugs.map((lifestyleTag) => ({ lifestyleTag }));
}

type PageProps = {
  params: Promise<{ locale: string; lifestyleTag: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw, lifestyleTag } = await params;
  if (!isLocale(raw) || !isLifestyleTagSlug(lifestyleTag)) return {};
  const locale = raw as Locale;
  const dictionary = await getDictionary(locale);
  const tagCopy = dictionary.pages.lifestyleOverview.tags[lifestyleTag];
  return { title: `${tagCopy.title} — ${dictionary.meta.appTitle}` };
}

export default async function LifestyleOverviewPage({ params }: PageProps) {
  const { locale: raw, lifestyleTag } = await params;
  if (!isLocale(raw)) return null;
  if (!isLifestyleTagSlug(lifestyleTag)) notFound();
  const locale = raw as Locale;
  const tag: LifestyleTagSlug = lifestyleTag;

  const [dictionary, catalog] = await Promise.all([
    getDictionary(locale),
    getHomeCatalog(locale),
  ]);

  const filtered = filterCatalogProducts(catalog.products, { lifestyleTag: tag });
  const overview = dictionary.pages.lifestyleOverview;
  const tagCopy = overview.tags[tag];

  return (
    <LifestyleProductOverview
      notice={overview.notice}
      products={filtered}
      productsRegionLabel={overview.productsRegionLabel}
      subtitle={tagCopy.subtitle}
      tagDisplay={tagCopy.tagLabel}
      title={tagCopy.title}
    />
  );
}
