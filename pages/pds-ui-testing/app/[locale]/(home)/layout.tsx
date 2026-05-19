import { GlobalHeader } from "@/app/components/header/GlobalHeader";
import { isLocale, type Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Renders the transparent overlay header on top of the home hero. */
export default async function HomeLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return null;
  const locale: Locale = raw;
  const dictionary = await getDictionary(locale);

  return (
    <>
      <GlobalHeader dictionary={dictionary} heroOverlay locale={locale} />
      {children}
    </>
  );
}
