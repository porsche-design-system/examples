import type { Metadata } from 'next';
import { NewsletterSubscriptionForm } from '@/app/components/newsletter/NewsletterSubscriptionForm';
import { isLocale, type Locale } from '@/app/i18n/config';
import { getDictionary } from '@/app/i18n/get-dictionary';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dictionary = await getDictionary(raw);
  return { title: dictionary.pages.newsletter.title };
}

export default async function NewsletterPage({ params }: PageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return null;
  const locale = raw as Locale;
  const dictionary = await getDictionary(locale);

  return <NewsletterSubscriptionForm copy={dictionary.pages.newsletter} />;
}
