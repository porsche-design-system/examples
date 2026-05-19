import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PDivider,
  PHeading,
  PLinkPure,
  PTag,
  PText,
} from "@porsche-design-system/components-react/ssr";
import { CatalogProductGrid } from "@/app/components/CatalogProductGrid";
import { PAGE_HEADING_ID } from "@/app/lib/skip-to-page-heading";
import { ProductDetailFavoriteButton } from "@/app/components/ProductDetailFavoriteButton";
import { ProductDetailPrice } from "@/app/components/ProductDetailPrice";
import { ProductInquiryFlyout } from "@/app/components/ProductInquiryFlyout";
import { ProductSizeComparisonSheet } from "@/app/components/ProductSizeComparisonSheet";
import { ProductSizeSelector } from "@/app/components/ProductSizeSelector";
import { productHasNewReleaseFlag } from "@/app/data/catalog-product-flags";
import {
  getCatalogProductBySlug,
  getHomeCatalog,
  getRelatedCatalogProducts,
} from "@/app/data/get-catalog";
import { isLocale, locales, type Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";
import { appHref, productsIndexHref } from "@/app/i18n/href";

export const dynamicParams = false;

type PageProps = {
  params: Promise<{ locale: string; productSlug: string }>;
};

export async function generateStaticParams() {
  const params = await Promise.all(
    locales.map(async (locale) => {
      const catalog = await getHomeCatalog(locale);
      return catalog.products.map((product) => ({
        locale,
        productSlug: product.slug,
      }));
    }),
  );
  return params.flat();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: raw, productSlug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const [dictionary, catalog] = await Promise.all([
    getDictionary(locale),
    getHomeCatalog(locale),
  ]);
  const product = getCatalogProductBySlug(catalog.products, productSlug);
  if (!product) return {};
  return {
    title: `${product.name} — ${dictionary.meta.appTitle}`,
    description: product.teaser,
  };
}

function labelsFor(values: readonly string[], labels: Record<string, string>) {
  return values.map((value) => labels[value] ?? value);
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale: raw, productSlug } = await params;
  if (!isLocale(raw)) return null;
  const locale: Locale = raw;

  const [dictionary, catalog] = await Promise.all([
    getDictionary(locale),
    getHomeCatalog(locale),
  ]);
  const product = getCatalogProductBySlug(catalog.products, productSlug);
  if (!product) notFound();

  const relatedProducts = getRelatedCatalogProducts(catalog.products, product);
  const { productDetail, productList } = dictionary.pages;
  const primaryImage = product.images[0];
  const categoryLabels = labelsFor(
    product.categories,
    productList.filters.categories as Record<string, string>,
  );
  const tagLabels = labelsFor(
    product.tags,
    productList.filters.tags as Record<string, string>,
  );
  const collectionLabels = labelsFor(
    product.collections,
    productList.filters.collections as Record<string, string>,
  );
  const isApparelProduct = product.categories.includes("apparel");

  return (
    <main
      className="grid-template gap-y-fluid-xl py-fluid-lg"
      data-testid="main-content"
    >
      <div className="col-wide">
        <PLinkPure href={productsIndexHref(locale)} icon="arrow-left">
          {productDetail.backToProducts}
        </PLinkPure>
      </div>

      <div className="col-wide grid grid-cols-subgrid">
        <div className="col-span-full md:col-span-one-half overflow-hidden rounded-lg bg-surface">
          {/* biome-ignore lint/performance/noImgElement: Product detail uses the same public demo assets as PDS tile slots. */}
          <img
            alt={primaryImage?.alt ?? ""}
            className="aspect-3/4 h-full w-full object-cover"
            src={appHref(primaryImage?.src ?? "/home-product-keychain.jpg")}
          />
        </div>

        <section
          aria-labelledby="product-detail-heading"
          className="col-span-full md:col-start-11 flex flex-col gap-fluid-md"
        >
          <div className="flex flex-wrap gap-static-sm">
            {productHasNewReleaseFlag(product) ? (
              <PTag compact key="new-release">
                {productList.newReleaseTag}
              </PTag>
            ) : null}
            {[...categoryLabels, ...collectionLabels, ...tagLabels].map(
              (label) => (
                <PTag compact key={label}>
                  {label}
                </PTag>
              ),
            )}
          </div>
          <div className="flex flex-col items-start gap-fluid-sm">
            <PHeading id={PAGE_HEADING_ID} size="3xl" tag="h1">
              {product.name}
            </PHeading>
            <PText color="contrast-medium">{product.teaser}</PText>
          </div>
          <ProductDetailPrice copy={productList.pricing} product={product} />
          {isApparelProduct ? (
            <>
              <PDivider />
              <div className="flex flex-col items-start gap-static-sm">
                <PHeading id="product-size-heading" size="medium" tag="h2">
                  {productDetail.sizes}
                </PHeading>
                <ProductSizeSelector label={productDetail.selectSize} />
                <ProductSizeComparisonSheet
                  copy={productDetail.sizeComparison}
                />
              </div>
              <PDivider />
            </>
          ) : null}
          <div className="flex flex-wrap gap-static-sm">
            <ProductInquiryFlyout
              copy={productDetail.inquiry}
              productImageAlt={primaryImage?.alt ?? ""}
              productImageSrc={appHref(
                primaryImage?.src ?? "/home-product-keychain.jpg",
              )}
              productName={product.name}
            />
            <ProductDetailFavoriteButton
              labelAdd={productDetail.favorites}
              labelRemove={productDetail.favoritesRemove}
              productSlug={product.slug}
            />
          </div>
          <div className="flex flex-col items-start gap-static-sm">
            <PHeading id="product-detail-heading" size="medium" tag="h2">
              {productDetail.details}
            </PHeading>
            <PText>{product.description}</PText>
            <PText color="contrast-medium" size="small">
              {productDetail.sku}: {product.sku}
            </PText>
          </div>
        </section>
      </div>

      {relatedProducts.length > 0 ? (
        <>
          <div className="col-wide">
            <PHeading size="2xl" tag="h2">
              {productDetail.relatedProducts}
            </PHeading>
          </div>
          <CatalogProductGrid
            locale={locale}
            newReleaseTagLabel={productList.newReleaseTag}
            pricingCopy={productList.pricing}
            products={relatedProducts}
            sectionAriaLabel={productDetail.relatedProducts}
          />
        </>
      ) : null}
    </main>
  );
}
