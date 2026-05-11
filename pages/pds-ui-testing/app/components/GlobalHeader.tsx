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

type Props = {
  dictionary: Dictionary;
  locale: Locale;
  /** Transparent bar over the home hero (see landing-page template). */
  heroOverlay?: boolean;
};

export function GlobalHeader({
  dictionary,
  locale,
  heroOverlay = false,
}: Props) {
  const { header, nav } = dictionary;
  const homeHref = localeHomeHref(locale);

  return (
    <header
      className={
        heroOverlay
          ? "z-30 grid-template absolute inset-x-0 top-0 gap-y-0 px-fluid-sm py-fluid-sm sm:px-fluid-md md:px-fluid-lg md:py-fluid-md"
          : "grid-template gap-y-0 bg-canvas py-fluid-sm md:py-fluid-md"
      }
      data-testid="global-header"
    >
      <div className="col-wide grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-fluid-xs sm:gap-fluid-md">
        <div className="flex min-w-0 flex-wrap items-center justify-start gap-static-xs sm:gap-static-sm">
          <nav
            aria-label={nav.main}
            className="flex min-w-0 items-center"
            id="main-navigation"
          >
            <GlobalHeaderNavMenu
              menuButtonClassName={heroOverlay ? "scheme-dark" : undefined}
              nav={nav}
            />
          </nav>
        </div>
        <div className="flex shrink-0 justify-center">
          <PCrest
            aria={{ "aria-label": header.crestLabel }}
            className={heroOverlay ? "scheme-dark sm:hidden" : "sm:hidden"}
            href={homeHref}
          />
          <PWordmark
            className={
              heroOverlay
                ? "scheme-dark max-sm:hidden shrink-0"
                : "max-sm:hidden shrink-0"
            }
            href={homeHref}
            size="small"
          />
        </div>
        <div
          className={
            heroOverlay
              ? "scheme-dark flex min-w-0 flex-wrap items-center justify-end gap-static-xs sm:gap-static-md"
              : "flex min-w-0 flex-wrap items-center justify-end gap-static-xs sm:gap-static-md"
          }
        >
          {heroOverlay ? (
            <>
              <PButtonPure
                className="p-static-xs -m-static-xs"
                hideLabel
                icon="star"
                size={{ base: "small", m: "medium" }}
                type="button"
              >
                {header.favorites}
              </PButtonPure>
              <PButtonPure
                className="p-static-xs -m-static-xs"
                hideLabel
                icon="search"
                size={{ base: "small", m: "medium" }}
                type="button"
              >
                {header.search}
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
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
