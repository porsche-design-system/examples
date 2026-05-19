import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import {
  getComponentChunkLinks,
  getFontLinks,
  getIconLinks,
  getMetaTagsAndIconLinks,
} from "@porsche-design-system/components-react/partials";
import { PorscheDesignSystemProvider } from "@porsche-design-system/components-react/ssr";
import { ProductFavoriteToasts } from "@/app/components/favorites/ProductFavoriteToasts";
import { ProductFavoritesProvider } from "@/app/components/favorites/ProductFavoritesProvider";
import { GlobalFooter } from "@/app/components/layout/GlobalFooter";
import { isLocale, locales, type Locale } from "@/app/i18n/config";
import { getDictionary } from "@/app/i18n/get-dictionary";
import "@/app/globals.css";

const APP_TITLE = "PDS UI Testing";

/** Reject any locale segment that is not in `locales`. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dictionary = await getDictionary(raw);
  return {
    description: dictionary.meta.description,
    title: {
      default: dictionary.meta.appTitle,
      template: `%s | ${dictionary.meta.appTitle}`,
    },
  };
}

export default async function LocaleRootLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dictionary = await getDictionary(locale);

  return (
    <html className="scheme-light-dark" lang={locale}>
      <head>
        <base
          href={
            process.env.NEXT_PUBLIC_BASE_PATH
              ? `${process.env.NEXT_PUBLIC_BASE_PATH}/`
              : "/"
          }
        />
        {getFontLinks({ format: "jsx" })}
        {getComponentChunkLinks({ format: "jsx" })}
        {getIconLinks({ format: "jsx" })}
        {getMetaTagsAndIconLinks({ appTitle: APP_TITLE, format: "jsx" })}
      </head>
      <body>
        <PorscheDesignSystemProvider>
          <ProductFavoritesProvider>
            {children}
            <ProductFavoriteToasts
              copy={{
                added: dictionary.header.favoritesToastAdded,
                removed: dictionary.header.favoritesToastRemoved,
              }}
            />
          </ProductFavoritesProvider>
          <GlobalFooter dictionary={dictionary} locale={locale} />
        </PorscheDesignSystemProvider>
      </body>
    </html>
  );
}
