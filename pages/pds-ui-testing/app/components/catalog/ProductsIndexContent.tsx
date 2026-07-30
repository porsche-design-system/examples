import { PHeading, PText } from '@porsche-design-system/components-react/ssr';
import { Suspense } from 'react';
import { CatalogProductGrid } from '@/app/components/catalog/CatalogProductGrid';
import { ProductCatalogBrowser } from '@/app/components/catalog/ProductCatalogBrowser';
import { MainContent } from '@/app/components/layout/MainContent';
import type { CatalogProduct } from '@/app/data/get-catalog';
import type { Locale } from '@/app/i18n/config';
import type { Dictionary } from '@/app/i18n/get-dictionary';
import { PAGE_HEADING_ID } from '@/app/lib/skip-to-page-heading';

type Props = {
  copy: Dictionary['pages']['productList'];
  locale: Locale;
  products: CatalogProduct[];
};

/** Default full-catalog listing (`/[locale]/products/`). */
export function ProductsIndexContent({ copy, locale, products }: Props) {
  return (
    <MainContent className="grid-template mt-fluid-xl">
      <div className="col-wide mx-auto flex max-w-[720px] flex-col items-center gap-fluid-sm text-center">
        <PHeading id={PAGE_HEADING_ID} size="3xl" tag="h1">
          {copy.title}
        </PHeading>
        <PText color="contrast-medium" size="sm">
          {copy.subtitle}
        </PText>
      </div>
      <Suspense
        fallback={
          <CatalogProductGrid
            locale={locale}
            newReleaseTagLabel={copy.newReleaseTag}
            pricingCopy={copy.pricing}
            products={products}
            sectionAriaLabel={copy.productsRegionLabel}
          />
        }
      >
        <ProductCatalogBrowser copy={copy} locale={locale} products={products} />
      </Suspense>
    </MainContent>
  );
}
