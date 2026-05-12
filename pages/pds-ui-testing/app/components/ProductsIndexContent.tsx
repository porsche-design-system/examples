import { Suspense } from "react";
import { PHeading, PText } from "@porsche-design-system/components-react/ssr";
import { CatalogProductGrid } from "@/app/components/CatalogProductGrid";
import { ProductCatalogBrowser } from "@/app/components/ProductCatalogBrowser";
import type { CatalogProduct } from "@/app/data/get-catalog";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";

type Props = {
  copy: Dictionary["pages"]["productList"];
  locale: Locale;
  products: CatalogProduct[];
};

/** Default full-catalog listing (`/[locale]/products/`). */
export function ProductsIndexContent({
  copy,
  locale,
  products,
}: Props) {
  return (
    <main className="grid-template gap-y-fluid-lg py-fluid-lg" data-testid="main-content">
      <div className="col-wide flex max-w-prose flex-col gap-fluid-sm">
        <PHeading size="3xl" tag="h1">
          {copy.title}
        </PHeading>
        <PText color="contrast-medium" size="small">
          {copy.subtitle}
        </PText>
        <PText>{copy.notice}</PText>
      </div>
      <Suspense
        fallback={
          <CatalogProductGrid
            locale={locale}
            products={products}
            sectionAriaLabel={copy.productsRegionLabel}
          />
        }
      >
        <ProductCatalogBrowser copy={copy} locale={locale} products={products} />
      </Suspense>
    </main>
  );
}
