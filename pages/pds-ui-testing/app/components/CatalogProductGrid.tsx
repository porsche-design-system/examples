import { PTag } from "@porsche-design-system/components-react/ssr";
import { FavoriteLinkTileProduct } from "@/app/components/FavoriteLinkTileProduct";
import type { CatalogProduct } from "@/app/data/get-catalog";
import type { Locale } from "@/app/i18n/config";

type Props = {
  /** Accessible name for the product grid region (e.g. “Products in this look”). */
  sectionAriaLabel: string;
  locale: Locale;
  products: CatalogProduct[];
};

function getNewFlagLabel(locale: Locale): string {
  return locale === "de" ? "Neu" : "New";
}

/**
 * Porsche Grid product strip shared by the full catalog, filtered views, and
 * related product sections.
 */
export function CatalogProductGrid({
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
            <FavoriteLinkTileProduct locale={locale} product={product}>
              {product.flags.includes("new") ? (
                <PTag compact slot="header">
                  {getNewFlagLabel(locale)}
                </PTag>
              ) : null}
            </FavoriteLinkTileProduct>
          </article>
        ))}
      </div>
    </section>
  );
}
