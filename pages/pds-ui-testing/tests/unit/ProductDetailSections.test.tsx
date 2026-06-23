import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ProductDetailSections } from "@/app/components/product/ProductDetailSections";
import { createCatalogProduct } from "./fixtures/catalog-product";

vi.mock("@porsche-design-system/components-react/ssr", () => ({
  PAccordion: ({
    children,
    open,
  }: {
    children?: ReactNode;
    open?: boolean;
  }) => (
    <div data-open={open} data-testid="accordion">
      {children}
    </div>
  ),
  PHeading: ({ children, slot }: { children?: ReactNode; slot?: string }) => (
    <h3 data-slot={slot}>{children}</h3>
  ),
  PAiTag: () => "",
  PText: ({ children }: { children?: ReactNode }) => <p>{children}</p>,
  PTextList: ({ children }: { children?: ReactNode }) => <ul>{children}</ul>,
  PTextListItem: ({ children }: { children?: ReactNode }) => (
    <li>{children}</li>
  ),
}));

const copy = {
  detailsSections: {
    description: "Description",
    dimensionsAndWeight: "Dimensions and weight",
    materialAndCare: "Material and care instructions",
    generalCharacteristics: "General characteristics",
  },
  detailsFields: {
    dimensions: "Dimensions",
    weight: "Weight",
    material: "Material",
    careInstructions: "Care Instructions",
    itemNumber: "Item no.",
    warning: "WARNING",
  },
} as const;

describe("ProductDetailSections", () => {
  it("renders accordion panel summaries and item number", () => {
    const product = createCatalogProduct({ sku: "WAP-TEST-001" });

    render(<ProductDetailSections copy={copy} product={product} />);

    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Dimensions and weight")).toBeInTheDocument();
    expect(
      screen.getByText("Material and care instructions"),
    ).toBeInTheDocument();
    expect(screen.getByText("General characteristics")).toBeInTheDocument();
    expect(screen.getByText("Item no.: WAP-TEST-001")).toBeInTheDocument();
    expect(screen.getByText("Extended test description.")).toBeInTheDocument();
    expect(screen.getByText("Feature one")).toBeInTheDocument();
  });
});
