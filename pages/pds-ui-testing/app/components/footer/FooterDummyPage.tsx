import { PHeading, PText } from '@porsche-design-system/components-react/ssr';
import { MainContent } from '@/app/components/layout/MainContent';
import { PAGE_HEADING_ID } from '@/app/lib/skip-to-page-heading';

type Props = {
  title: string;
  notice: string;
};

/** Placeholder for footer targets in usability / accessibility testing sessions. */
export function FooterDummyPage({ title, notice }: Props) {
  return (
    <MainContent className="grid-template py-fluid-lg">
      <div className="col-wide flex max-w-prose flex-col gap-fluid-sm">
        <PHeading id={PAGE_HEADING_ID} tag="h1">
          {title}
        </PHeading>
        <PText>{notice}</PText>
      </div>
    </MainContent>
  );
}
