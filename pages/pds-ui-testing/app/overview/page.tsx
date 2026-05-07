import {
  PHeading,
  PLinkPure,
} from "@porsche-design-system/components-react/ssr";
import type { Metadata } from "next";
import { detailSampleIds } from "../detail/sample-ids";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  const [firstDetailId] = detailSampleIds;
  return (
    <main data-testid="main-content">
      <PHeading tag="h1">Overview</PHeading>
      <PLinkPure href={`detail/${firstDetailId}/`} icon="arrow-head-right">
        Go to detail
      </PLinkPure>
    </main>
  );
}
