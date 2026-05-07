import {
  PHeading,
  PLinkPure,
} from "@porsche-design-system/components-react/ssr";
import type { Metadata } from "next";
import { detailSampleIds } from "../../detail/sample-ids";
import { isLocale, type Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/get-dictionary";
import { appHref } from "../../i18n/href";

type OverviewPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: OverviewPageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return {};
  }
  const dictionary = await getDictionary(raw);
  return { title: dictionary.pages.overview.title };
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return null;
  }
  const locale: Locale = raw;
  const dictionary = await getDictionary(locale);
  const { overview } = dictionary.pages;
  const [firstDetailId] = detailSampleIds;

  return (
    <main data-testid="main-content">
      <PHeading tag="h1">{overview.title}</PHeading>
      <PLinkPure
        href={appHref(`/${locale}/detail/${firstDetailId}/`)}
        icon="arrow-head-right"
      >
        {overview.goToDetail}
      </PLinkPure>
    </main>
  );
}
