import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FooterDummyPage } from "@/app/components/layout/FooterDummyPage";
import { isLocale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";

const COMPANY_SLUGS = [
  "glance",
  "pcna",
  "sustainability",
  "career",
  "press",
] as const;

type CompanySlug = (typeof COMPANY_SLUGS)[number];

function isCompanySlug(value: string): value is CompanySlug {
  return (COMPANY_SLUGS as readonly string[]).includes(value);
}

function companyTitle(
  slug: CompanySlug,
  footer: Awaited<ReturnType<typeof getDictionary>>["footer"],
): string {
  switch (slug) {
    case "glance":
      return footer.companyLinks.glance;
    case "pcna":
      return footer.companyLinks.na;
    case "sustainability":
      return footer.companyLinks.sustainability;
    case "career":
      return footer.companyLinks.career;
    case "press":
      return footer.companyLinks.press;
  }
}

type PageProps = {
  params: Promise<{ locale: string; companySlug: string }>;
};

export function generateStaticParams() {
  return COMPANY_SLUGS.map((companySlug) => ({ companySlug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: raw, companySlug } = await params;
  if (!isLocale(raw) || !isCompanySlug(companySlug)) {
    return {};
  }
  const dictionary = await getDictionary(raw);
  const title = companyTitle(companySlug, dictionary.footer);
  return { title };
}

export default async function CompanyFooterDummyPage({ params }: PageProps) {
  const { locale: raw, companySlug } = await params;
  if (!isLocale(raw) || !isCompanySlug(companySlug)) {
    notFound();
  }
  const dictionary = await getDictionary(raw);
  const title = companyTitle(companySlug, dictionary.footer);

  return (
    <FooterDummyPage
      notice={dictionary.pages.dummy.notice}
      title={title}
    />
  );
}
