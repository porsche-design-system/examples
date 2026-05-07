import {
  PHeading,
  PLinkPure,
} from "@porsche-design-system/components-react/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <main data-testid="main-content">
      <PHeading tag="h1">Checkout</PHeading>
      <PLinkPure href="/" icon="arrow-head-right">
        Go to home
      </PLinkPure>
    </main>
  );
}
