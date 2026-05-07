import {
  PHeading,
  PLinkPure,
} from "@porsche-design-system/components-react/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <main data-testid="main-content">
      <PHeading tag="h1">Home</PHeading>
      <PLinkPure href="overview/" icon="arrow-head-right">
        Go to overview
      </PLinkPure>
      <PLinkPure href="checkout/" icon="arrow-head-right">
        Go to checkout
      </PLinkPure>
    </main>
  );
}
