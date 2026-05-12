import { PLinkTileProduct } from "@porsche-design-system/components-react/ssr";
import type { CatalogProduct } from "@/app/data/get-catalog";
import type { Locale } from "@/app/i18n/config";
import { appHref, productDetailHref } from "@/app/i18n/href";

type Props = {
  /** Accessible name for the product grid region (e.g. “Products in this look”). */
  sectionAriaLabel: string;
  locale: Locale;
  products: CatalogProduct[];
};

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
            <PLinkTileProduct
              aspectRatio="3/4"
              description={product.vatNote}
              heading={product.name}
              href={productDetailHref(locale, product.slug)}
              price={product.price.formatted}
            >
              {/* biome-ignore lint/performance/noImgElement: PLinkTileProduct default slot expects a bare <img>. */}
              <img
                alt={product.images[0]?.alt ?? ""}
                src={appHref(
                  product.images[0]?.src ?? "/home-product-keychain.jpg",
                )}
              />
            </PLinkTileProduct>
          </article>
        ))}
      </div>
    </section>
  );
}
