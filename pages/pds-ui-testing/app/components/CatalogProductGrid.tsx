import { PLinkTileProduct } from "@porsche-design-system/components-react/ssr";
import type { CatalogProduct } from "@/app/data/get-catalog";
import { appHref } from "@/app/i18n/href";

type Props = {
  /** Accessible name for the product grid region (e.g. “Products in this look”). */
  sectionAriaLabel: string;
  products: CatalogProduct[];
};

/**
 * Porsche Grid product strip shared by the full catalog (`/products`) and
 * filtered views (e.g. `/lifestyle/[tag]`). Listing pages use in-page `#id`
 * targets; detail routes can switch `href` later without changing layout.
 */
export function CatalogProductGrid({ sectionAriaLabel, products }: Props) {
  return (
    <section
      aria-label={sectionAriaLabel}
      className="col-full grid grid-cols-subgrid"
    >
      <div className="col-basic grid grid-cols-subgrid gap-fluid-md">
        {products.map((product) => (
          <div
            className="col-span-full scroll-mt-fluid-lg md:col-span-one-third"
            id={product.id}
            key={product.id}
          >
            <PLinkTileProduct
              aspectRatio="3/4"
              description={product.vatNote}
              heading={product.heading}
              href={`#${product.id}`}
              price={product.price}
            >
              {/* biome-ignore lint/performance/noImgElement: PLinkTileProduct default slot expects a bare <img>. */}
              <img alt={product.imageAlt} src={appHref(product.imageSrc)} />
            </PLinkTileProduct>
          </div>
        ))}
      </div>
    </section>
  );
}
