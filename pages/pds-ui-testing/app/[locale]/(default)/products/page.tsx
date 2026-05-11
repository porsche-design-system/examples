import type { Metadata } from "next";
import { ProductsIndexContent } from "@/app/components/ProductsIndexContent";
import { getHomeCatalog } from "@/app/data/get-catalog";
import { isLocale, type Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dictionary = await getDictionary(locale);
  const { productList } = dictionary.pages;
  return { title: `${productList.title} — ${dictionary.meta.appTitle}` };
}

export default async function ProductsIndexPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return null;
  const locale = raw as Locale;

  const [dictionary, catalog] = await Promise.all([
    getDictionary(locale),
    getHomeCatalog(locale),
  ]);

  const { productList } = dictionary.pages;

  return (
    <ProductsIndexContent
      notice={productList.notice}
      products={catalog.products}
      productsRegionLabel={productList.productsRegionLabel}
      subtitle={productList.subtitle}
      title={productList.title}
    />
  );
}
