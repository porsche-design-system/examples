import { PTag } from "@porsche-design-system/components-react/ssr";
import {
  FavoriteLinkTileProduct,
  type TilePricingCopy,
} from "@/app/components/FavoriteLinkTileProduct";
import { productHasNewReleaseFlag } from "@/app/data/catalog-product-flags";
import type { CatalogProduct } from "@/app/data/get-catalog";
import type { Locale } from "@/app/i18n/config";

type Props = {
  /** Accessible name for the product grid region (e.g. “Products in this look”). */
  sectionAriaLabel: string;
  locale: Locale;
  newReleaseTagLabel: string;
  pricingCopy?: TilePricingCopy;
  products: CatalogProduct[];
};

/**
 * Porsche Grid product strip shared by the full catalog, filtered views, and
 * related product sections.
 */
export function CatalogProductGrid({
  newReleaseTagLabel,
  pricingCopy,
  sectionAriaLabel,
  locale,
  products,
}: Props) {
  return (
    <section
      aria-label={sectionAriaLabel}
      className="col-full grid grid-cols-subgrid"
    >
      <div className="col-basic grid grid-cols-subgrid gap-fluid-md">
        {products.map((product) => (
          <article
            aria-label={product.name}
            className="col-span-full scroll-mt-fluid-lg md:col-span-one-third"
            id={product.id}
            key={product.id}
          >
            <FavoriteLinkTileProduct
              locale={locale}
              pricingCopy={pricingCopy}
              product={product}
            >
              {productHasNewReleaseFlag(product) ? (
                <PTag compact slot="header">
                  {newReleaseTagLabel}
                </PTag>
              ) : null}
            </FavoriteLinkTileProduct>
          </article>
        ))}
      </div>
    </section>
  );
}
