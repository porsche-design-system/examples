"use client";

import { useCallback, useState } from "react";
import {
  PButtonPure,
  PDrilldown,
  PDrilldownItem,
  PDrilldownLink,
} from "@porsche-design-system/components-react/ssr";
import type {
  DrilldownUpdateEventDetail,
  SelectedAriaAttributes,
  ButtonPureAriaAttribute,
} from "@porsche-design-system/components-react/ssr";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import { productsFilterHref } from "@/app/i18n/href";

const SHOP_NAV_DRILLDOWN_ID = "shop-navigation-drilldown";

type Props = {
  locale: Locale;
  nav: Dictionary["nav"];
  menuButtonClassName?: string;
};

export function GlobalHeaderNavMenu({
  locale,
  nav,
  menuButtonClassName,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activeIdentifier, setActiveIdentifier] = useState<
    string | undefined
  >();

  const toggleOpen = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  const handleDismiss = useCallback(() => {
    setOpen(false);
    setActiveIdentifier(undefined);
  }, []);

  const handleUpdate = useCallback(
    (event: CustomEvent<DrilldownUpdateEventDetail>) => {
      setActiveIdentifier(event.detail.activeIdentifier);
    },
    [],
  );

  const menuButtonAria = {
    "aria-expanded": open,
    "aria-haspopup": "dialog" as const,
  } as SelectedAriaAttributes<ButtonPureAriaAttribute>;

  return (
    <>
      <PButtonPure
        aria={menuButtonAria}
        className={
          menuButtonClassName
            ? `${menuButtonClassName} p-static-xs -m-static-xs`
            : "p-static-xs -m-static-xs"
        }
        hideLabel={{ base: true, s: false }}
        icon="menu-lines"
        onClick={toggleOpen}
        size={{ base: "small", m: "medium" }}
        type="button"
      >
        {nav.menu}
      </PButtonPure>
      <PDrilldown
        activeIdentifier={activeIdentifier}
        aria={{ "aria-label": nav.shopCategories }}
        id={SHOP_NAV_DRILLDOWN_ID}
        onDismiss={handleDismiss}
        onUpdate={handleUpdate}
        open={open}
      >
        <PDrilldownItem identifier="apparel" label={nav.clothing}>
          <PDrilldownLink
            href={productsFilterHref(locale, { audiences: ["women"] })}
          >
            {nav.viewAllWomen}
          </PDrilldownLink>
          <PDrilldownLink
            href={productsFilterHref(locale, { audiences: ["men"] })}
          >
            {nav.viewAllMen}
          </PDrilldownLink>
          <PDrilldownLink
            href={productsFilterHref(locale, { audiences: ["kids"] })}
          >
            {nav.viewAllKids}
          </PDrilldownLink>
          <PDrilldownLink
            href={productsFilterHref(locale, { categories: ["apparel"] })}
          >
            {nav.viewAllProducts}
          </PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="accessories" label={nav.accessories}>
          <PDrilldownLink
            href={productsFilterHref(locale, { categories: ["bags-luggage"] })}
          >
            {nav.bagsLuggage}
          </PDrilldownLink>
          <PDrilldownLink
            href={productsFilterHref(locale, {
              categories: ["travel-transport"],
            })}
          >
            {nav.travelTransport}
          </PDrilldownLink>
          <PDrilldownLink
            href={productsFilterHref(locale, { categories: ["accessories"] })}
          >
            {nav.chargingHardware}
          </PDrilldownLink>
          <PDrilldownLink
            href={productsFilterHref(locale, { categories: ["accessories"] })}
          >
            {nav.viewAllProducts}
          </PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownLink
          href={productsFilterHref(locale, {
            collections: ["porsche-originals"],
          })}
        >
          {nav.porscheOriginals}
        </PDrilldownLink>
        <PDrilldownLink
          href={productsFilterHref(locale, {
            collections: ["porsche-design"],
          })}
        >
          {nav.porscheDesign}
        </PDrilldownLink>
        <PDrilldownLink
          href={productsFilterHref(locale, { flags: ["new-release"] })}
        >
          {nav.newReleases}
        </PDrilldownLink>
      </PDrilldown>
    </>
  );
}
