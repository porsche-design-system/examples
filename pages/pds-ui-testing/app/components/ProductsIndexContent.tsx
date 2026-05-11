import { PHeading, PText } from "@porsche-design-system/components-react/ssr";
import { CatalogProductGrid } from "@/app/components/CatalogProductGrid";
import type { CatalogProduct } from "@/app/data/get-catalog";

type Props = {
  title: string;
  subtitle: string;
  notice: string;
  productsRegionLabel: string;
  products: CatalogProduct[];
};

/** Default full-catalog listing (`/[locale]/products/`). */
export function ProductsIndexContent({
  title,
  subtitle,
  notice,
  productsRegionLabel,
  products,
}: Props) {
  return (
    <main className="grid-template gap-y-fluid-lg py-fluid-lg" data-testid="main-content">
      <div className="col-wide flex max-w-prose flex-col gap-fluid-sm">
        <PHeading size="3xl" tag="h1">
          {title}
        </PHeading>
        <PText color="contrast-medium" size="small">
          {subtitle}
        </PText>
        <PText>{notice}</PText>
      </div>
      <CatalogProductGrid
        products={products}
        sectionAriaLabel={productsRegionLabel}
      />
    </main>
  );
}
