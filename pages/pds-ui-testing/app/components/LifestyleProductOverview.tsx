import { PHeading, PTag, PText } from "@porsche-design-system/components-react/ssr";
import { CatalogProductGrid } from "@/app/components/CatalogProductGrid";
import type { CatalogProduct } from "@/app/data/get-catalog";

type Props = {
  title: string;
  subtitle: string;
  tagDisplay: string;
  notice: string;
  productsRegionLabel: string;
  products: CatalogProduct[];
};

/** Curated lifestyle listing: header + facet tag + shared {@link CatalogProductGrid}. */
export function LifestyleProductOverview({
  title,
  subtitle,
  tagDisplay,
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
        <PTag compact variant="primary">
          {tagDisplay}
        </PTag>
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
