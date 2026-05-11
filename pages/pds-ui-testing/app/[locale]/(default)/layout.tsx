import { GlobalHeader } from "@/app/components/GlobalHeader";
import { isLocale, type Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Renders the default opaque header for sub-routes (company, legal, …). */
export default async function DefaultLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return null;
  const locale: Locale = raw;
  const dictionary = await getDictionary(locale);

  return (
    <>
      <GlobalHeader dictionary={dictionary} locale={locale} />
      {children}
    </>
  );
}
