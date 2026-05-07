import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GlobalHeader } from "../components/GlobalHeader";
import { isLocale, type Locale } from "../i18n/config";
import { getDictionary } from "../i18n/get-dictionary";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "de" }];
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return {};
  }
  const dictionary = await getDictionary(raw);
  return {
    description: dictionary.meta.description,
    title: {
      default: dictionary.meta.appTitle,
      template: `%s | ${dictionary.meta.appTitle}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const locale: Locale = raw;
  const dictionary = await getDictionary(locale);

  return (
    <>
      <GlobalHeader dictionary={dictionary} locale={locale} />
      {children}
    </>
  );
}
