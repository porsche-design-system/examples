import {
  PHeading,
  PLinkPure,
} from "@porsche-design-system/components-react/ssr";
import type { Metadata } from "next";
import { detailSampleIds } from "../../../detail/sample-ids";
import { isLocale, type Locale } from "../../../i18n/config";
import { getDictionary } from "../../../i18n/get-dictionary";
import { appHref } from "../../../i18n/href";

type DetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export const generateStaticParams = () => {
  return detailSampleIds.map((id) => ({ id }));
};

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) {
    return {};
  }
  const dictionary = await getDictionary(raw);
  return {
    title: `${dictionary.pages.detail.title} (${id})`,
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) {
    return null;
  }
  const locale: Locale = raw;
  const dictionary = await getDictionary(locale);
  const { detail } = dictionary.pages;

  return (
    <main data-testid="main-content">
      <PHeading tag="h1">
        {detail.title} ({id})
      </PHeading>
      <PLinkPure href={appHref(`/${locale}/checkout/`)} icon="arrow-head-right">
        {detail.goToCheckout}
      </PLinkPure>
    </main>
  );
}
