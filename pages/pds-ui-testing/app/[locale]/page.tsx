import type { Metadata } from "next";
import { HomeHero } from "../components/HomeHero";
import { isLocale } from "../i18n/config";
import { getDictionary } from "../i18n/get-dictionary";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return {};
  }
  const dictionary = await getDictionary(raw);
  return { title: dictionary.pages.home.title };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) {
    return null;
  }
  const dictionary = await getDictionary(raw);
  const { home } = dictionary.pages;

  return (
    <main
      className="relative z-0 grid-template gap-y-fluid-md"
      data-testid="main-content"
    >
      <HomeHero
        alt={home.teaserAlt}
        ctaLabel={home.heroCta}
        heading={home.heroHeading}
      />
    </main>
  );
}
