import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FooterDummyPage } from "../../../../components/FooterDummyPage";
import { isLocale } from "../../../../i18n/config";
import { getDictionary } from "../../../../i18n/get-dictionary";

const LEGAL_SLUGS = [
  "notice",
  "icp",
  "environment",
  "security",
  "more",
] as const;

type LegalSlug = (typeof LEGAL_SLUGS)[number];

function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

function legalTitle(
  slug: LegalSlug,
  footer: Awaited<ReturnType<typeof getDictionary>>["footer"],
): string {
  switch (slug) {
    case "notice":
      return footer.legalNotice;
    case "icp":
      return footer.legalIcp;
    case "environment":
      return footer.legalEnv;
    case "security":
      return footer.legalSecurity;
    case "more":
      return footer.legalMoreInfo;
  }
}

type PageProps = {
  params: Promise<{ locale: string; legalSlug: string }>;
};

export function generateStaticParams() {
  return LEGAL_SLUGS.map((legalSlug) => ({ legalSlug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: raw, legalSlug } = await params;
  if (!isLocale(raw) || !isLegalSlug(legalSlug)) {
    return {};
  }
  const dictionary = await getDictionary(raw);
  const title = legalTitle(legalSlug, dictionary.footer);
  return { title };
}

export default async function LegalFooterDummyPage({ params }: PageProps) {
  const { locale: raw, legalSlug } = await params;
  if (!isLocale(raw) || !isLegalSlug(legalSlug)) {
    notFound();
  }
  const dictionary = await getDictionary(raw);
  const title = legalTitle(legalSlug, dictionary.footer);

  return (
    <FooterDummyPage
      notice={dictionary.pages.dummy.notice}
      title={title}
    />
  );
}
