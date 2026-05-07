import {
  PCrest,
  PButtonPure,
  PLinkPure,
  PWordmark,
} from "@porsche-design-system/components-react/ssr";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import { localeHomeHref } from "@/app/i18n/href";
import { GlobalHeaderNavMenu } from "./GlobalHeaderNavMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";

type Props = {
  dictionary: Dictionary;
  locale: Locale;
};

export function GlobalHeader({ dictionary, locale }: Props) {
  const { header, nav } = dictionary;
  const homeHref = localeHomeHref(locale);

  return (
    <header
      className="grid-template gap-y-0 bg-canvas border-contrast-low px-fluid-sm py-fluid-sm sm:px-fluid-md md:px-fluid-lg md:py-fluid-md"
      data-testid="global-header"
    >
      <div className="col-wide grid min-h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-fluid-xs sm:min-h-18 sm:gap-fluid-md md:min-h-20">
        <div className="flex min-w-0 flex-wrap items-center justify-start gap-static-xs sm:gap-static-sm">
          <nav
            aria-label={nav.main}
            className="flex min-w-0 items-center"
            id="main-navigation"
          >
            <GlobalHeaderNavMenu nav={nav} />
          </nav>
        </div>
        <div className="flex shrink-0 justify-center">
          <PCrest
            aria={{ "aria-label": header.crestLabel }}
            className="sm:hidden"
            href={homeHref}
          />
          <PWordmark
            className="max-sm:hidden shrink-0"
            href={homeHref}
            size="small"
          />
        </div>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-static-xs sm:gap-static-md">
          <LanguageSwitcher
            languageLabel={header.language}
            labels={header.localeNames}
            locale={locale}
          />
          <PButtonPure
            className="p-static-xs -m-static-xs"
            hideLabel
            icon="shopping-cart"
            size={{ base: "small", m: "medium" }}
          >
            {header.shoppingCart}
          </PButtonPure>
          <PLinkPure
            className="p-static-xs -m-static-xs"
            hideLabel
            href="#my-porsche"
            icon="user"
            size={{ base: "small", m: "medium" }}
          >
            {header.myPorsche}
          </PLinkPure>
        </div>
      </div>
    </header>
  );
}
