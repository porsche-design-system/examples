import { PHeading, PText } from "@porsche-design-system/components-react/ssr";
import { PAGE_HEADING_ID } from "@/app/constants/a11y";

type Props = {
  title: string;
  notice: string;
};

/** Placeholder for footer targets in usability / accessibility testing sessions. */
export function FooterDummyPage({ title, notice }: Props) {
  return (
    <main className="grid-template py-fluid-lg" data-testid="main-content">
      <div className="col-wide flex max-w-prose flex-col gap-fluid-sm">
        <PHeading id={PAGE_HEADING_ID} tag="h1">
          {title}
        </PHeading>
        <PText>{notice}</PText>
      </div>
    </main>
  );
}
