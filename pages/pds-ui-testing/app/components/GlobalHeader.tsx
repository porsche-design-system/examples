import {
  PCrest,
  PButtonPure,
  PLinkPure,
  PWordmark,
} from "@porsche-design-system/components-react/ssr";
import { GlobalHeaderNavMenu } from "./GlobalHeaderNavMenu";

export function GlobalHeader() {
  return (
    <header
      className="grid-template gap-y-0 bg-canvas border-contrast-low px-fluid-sm py-fluid-sm sm:px-fluid-md md:px-fluid-lg md:py-fluid-md"
      data-testid="global-header"
    >
      <div className="col-wide grid min-h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-fluid-xs sm:min-h-18 sm:gap-fluid-md md:min-h-20">
        <div className="flex min-w-0 flex-wrap items-center justify-start gap-static-xs sm:gap-static-sm">
          <nav
            aria-label="Main"
            className="flex min-w-0 items-center"
            id="main-navigation"
          >
            <GlobalHeaderNavMenu />
          </nav>
        </div>
        <div className="flex shrink-0 justify-center">
          <PCrest
            aria={{ "aria-label": "Porsche" }}
            className="sm:hidden"
            href="./"
          />
          <PWordmark
            className="max-sm:hidden shrink-0"
            href="./"
            size="small"
          />
        </div>
        <div className="flex min-w-0 items-center justify-end gap-static-xs sm:gap-static-md">
          <PButtonPure
            className="p-static-xs -m-static-xs"
            hideLabel
            icon="shopping-cart"
            size={{ base: "small", m: "medium" }}
          >
            Shopping cart
          </PButtonPure>
          <PLinkPure
            className="p-static-xs -m-static-xs"
            hideLabel
            href="#my-porsche"
            icon="user"
            size={{ base: "small", m: "medium" }}
          >
            My Porsche
          </PLinkPure>
        </div>
      </div>
    </header>
  );
}
