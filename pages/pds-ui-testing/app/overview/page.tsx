import {
  PHeading,
  PLinkPure,
} from "@porsche-design-system/components-react/ssr";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return (
    <main data-testid="main-content">
      <PHeading tag="h1">Overview</PHeading>
      <PLinkPure href="../detail/watch-001/" icon="arrow-head-right">
        Go to detail
      </PLinkPure>
    </main>
  );
}
