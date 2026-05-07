import {
  PHeading,
  PLinkPure,
} from "@porsche-design-system/components-react/ssr";
import type { Metadata } from "next";
import { detailSampleIds } from "../sample-ids";

type DetailPageProps = {
  params: Promise<{ id: string }>;
};

export const generateStaticParams = () => {
  return detailSampleIds.map((id) => ({ id }));
};

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Detail (${id})`,
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params;
  return (
    <main data-testid="main-content">
      <PHeading tag="h1">Detail ({id})</PHeading>
      <PLinkPure href="checkout/" icon="arrow-head-right">
        Go to checkout
      </PLinkPure>
    </main>
  );
}
