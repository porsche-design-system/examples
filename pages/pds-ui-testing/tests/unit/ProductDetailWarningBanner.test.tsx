import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductDetailWarningBanner } from "@/app/components/product/ProductDetailWarningBanner";

vi.mock("@porsche-design-system/components-react/ssr", () => ({
  PBanner: ({
    description,
    dismissButton,
    heading,
    headingTag,
    onDismiss,
    open,
    state,
  }: {
    description?: string;
    dismissButton?: boolean;
    heading?: string;
    headingTag?: string;
    onDismiss?: () => void;
    open?: boolean;
    state?: string;
  }) =>
    open ? (
      <div
        data-dismiss-button={dismissButton}
        data-heading-tag={headingTag}
        data-state={state}
        data-testid="warning-banner"
        role="status"
      >
        <h2>{heading}</h2>
        <p>{description}</p>
        {dismissButton ? (
          <button onClick={onDismiss} type="button">
            Close banner
          </button>
        ) : null}
      </div>
    ) : null,
}));

const copy = {
  heading: "Limited availability",
  description:
    "This item is running low on stock. Please inquire about availability before placing an order.",
} as const;

describe("ProductDetailWarningBanner", () => {
  it("renders an info banner with heading and description", () => {
    render(<ProductDetailWarningBanner copy={copy} />);

    const banner = screen.getByTestId("warning-banner");
    expect(banner).toHaveAttribute("data-state", "info");
    expect(banner).toHaveAttribute("data-heading-tag", "h2");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: copy.heading,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(copy.description)).toBeInTheDocument();
  });

  it("dismisses the banner when the close button is clicked", () => {
    render(<ProductDetailWarningBanner copy={copy} />);

    fireEvent.click(screen.getByRole("button", { name: "Close banner" }));

    expect(screen.queryByTestId("warning-banner")).not.toBeInTheDocument();
  });
});
