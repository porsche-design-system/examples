import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ProductDetailPrice } from "@/app/components/product/ProductDetailPrice";
import { createCatalogProduct } from "./fixtures/catalog-product";

vi.mock("@porsche-design-system/components-react/ssr", () => ({
  PText: ({
    children,
    className,
    ...rest
  }: {
    children?: ReactNode;
    className?: string;
  }) => (
    <p className={className} {...rest}>
      {children}
    </p>
  ),
}));

describe("ProductDetailPrice", () => {
  const copy = {
    detailAriaReduced: "Reduced from {originalPrice} to {salePrice}",
  };

  it("renders regular price and VAT note", () => {
    const product = createCatalogProduct({
      price: { amount: 79, currency: "USD", formatted: "$79.00" },
      vatNote: "incl. VAT",
    });
    delete (product as { priceOriginal?: unknown }).priceOriginal;

    render(<ProductDetailPrice copy={copy} product={product} />);

    expect(screen.getByText("$79.00")).toBeInTheDocument();
    expect(screen.getByText("incl. VAT")).toBeInTheDocument();
    expect(screen.queryByText("$100.00")).not.toBeInTheDocument();
  });

  it("renders sale price, strikethrough original, and accessible reduced label", () => {
    const product = createCatalogProduct({
      price: { amount: 75, currency: "USD", formatted: "$75.00" },
      priceOriginal: {
        amount: 100,
        currency: "USD",
        formatted: "$100.00",
      },
      vatNote: "incl. VAT",
    });

    render(<ProductDetailPrice copy={copy} product={product} />);

    expect(screen.getByText("$75.00")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(
      screen.getByText("Reduced from $100.00 to $75.00"),
    ).toHaveClass("sr-only");
    expect(screen.getByText("incl. VAT")).toBeInTheDocument();
  });
});
