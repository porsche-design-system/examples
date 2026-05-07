import {
  PHeading,
  PLinkPure,
} from "@porsche-design-system/components-react/ssr";
import type { Metadata } from "next";
import { isLocale, type Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/get-dictionary";
import { appHref } from "../../i18n/href";

type CheckoutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: CheckoutPageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return {};
  }
  const dictionary = await getDictionary(raw);
  return { title: dictionary.pages.checkout.title };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return null;
  }
  const locale: Locale = raw;
  const dictionary = await getDictionary(locale);
  const { checkout } = dictionary.pages;

  return (
    <main data-testid="main-content">
      <PHeading tag="h1">{checkout.title}</PHeading>
      <PLinkPure href={appHref(`/${locale}/`)} icon="arrow-head-right">
        {checkout.goToHome}
      </PLinkPure>
    </main>
  );
}
