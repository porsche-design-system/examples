import type { Metadata } from 'next';
import { ContactForm } from '@/app/components/contact/ContactForm';
import { isLocale, type Locale } from '@/app/i18n/config';
import { getDictionary } from '@/app/i18n/get-dictionary';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dictionary = await getDictionary(raw);
  return { title: dictionary.pages.contact.title };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return null;
  const locale = raw as Locale;
  const dictionary = await getDictionary(locale);

  return <ContactForm copy={dictionary.pages.contact} />;
}
