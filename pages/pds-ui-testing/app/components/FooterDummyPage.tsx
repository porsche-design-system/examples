import { PHeading, PText } from "@porsche-design-system/components-react/ssr";

type Props = {
  title: string;
  notice: string;
};

/** Placeholder for footer targets in usability / accessibility testing sessions. */
export function FooterDummyPage({ title, notice }: Props) {
  return (
    <main className="grid-template py-fluid-lg" data-testid="main-content">
      <div className="col-wide flex max-w-prose flex-col gap-fluid-sm">
        <PHeading tag="h1">{title}</PHeading>
        <PText>{notice}</PText>
      </div>
    </main>
  );
}
