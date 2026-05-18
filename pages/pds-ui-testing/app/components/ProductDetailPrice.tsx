import { PText } from "@porsche-design-system/components-react/ssr";
import {
  formatPriceTemplate,
  isReducedProduct,
} from "@/app/data/catalog-price";
import type { CatalogProduct } from "@/app/data/get-catalog";

type PricingCopy = {
  detailAriaReduced: string;
};

type Props = {
  copy: PricingCopy;
  product: CatalogProduct;
};

export function ProductDetailPrice({ copy, product }: Props) {
  if (!isReducedProduct(product)) {
    return (
      <div className="grid gap-static-xs">
        <PText size="large" weight="semibold">
          {product.price.formatted}
        </PText>
        <PText color="contrast-medium" size="small">
          {product.vatNote}
        </PText>
      </div>
    );
  }

  const reducedAriaLabel = formatPriceTemplate(copy.detailAriaReduced, {
    originalPrice: product.priceOriginal.formatted,
    salePrice: product.price.formatted,
  });

  return (
    <div className="grid gap-static-xs">
      <div className="flex flex-wrap items-baseline gap-static-xs">
        <PText size="large" weight="semibold">
          {product.price.formatted}
        </PText>
        <PText aria-hidden="true" color="contrast-medium" size="large">
          <s aria-hidden="true">{product.priceOriginal.formatted}</s>
          <span className="sr-only">{reducedAriaLabel}</span>
        </PText>
      </div>
      <PText color="contrast-medium" size="small">
        {product.vatNote}
      </PText>
    </div>
  );
}
