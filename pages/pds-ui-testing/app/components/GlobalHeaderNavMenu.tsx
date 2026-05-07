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
import type { Dictionary } from "@/app/i18n/get-dictionary";

const SHOP_NAV_DRILLDOWN_ID = "shop-navigation-drilldown";

type Props = {
  nav: Dictionary["nav"];
};

export function GlobalHeaderNavMenu({ nav }: Props) {
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
        alignLabel="start"
        aria={menuButtonAria}
        className="p-static-xs -m-static-xs"
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
        <PDrilldownItem identifier="women" label={nav.women}>
          <PDrilldownLink href="#shop/women">{nav.viewAllWomen}</PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="men" label={nav.men}>
          <PDrilldownLink href="#shop/men">{nav.viewAllMen}</PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="kids" label={nav.kids}>
          <PDrilldownLink href="#shop/kids">{nav.viewAllKids}</PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="accessories" label={nav.accessories}>
          <PDrilldownLink href="#shop/accessories/clothing">
            {nav.clothing}
          </PDrilldownLink>
          <PDrilldownLink href="#shop/accessories/charging">
            {nav.chargingHardware}
          </PDrilldownLink>
          <PDrilldownLink href="#shop/accessories">
            {nav.viewAllProducts}
          </PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="model-cars" label={nav.modelCars}>
          <PDrilldownLink href="#shop/model-cars">
            {nav.viewAllModelCars}
          </PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem
          identifier="porsche-originals"
          label={nav.porscheOriginals}
        >
          <PDrilldownLink href="#shop/porsche-originals">
            {nav.viewAllPorscheOriginals}
          </PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="porsche-design" label={nav.porscheDesign}>
          <PDrilldownLink href="#shop/porsche-design">
            {nav.viewAllPorscheDesign}
          </PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="new-releases" label={nav.newReleases}>
          <PDrilldownLink href="#shop/new-releases">
            {nav.viewAllNewReleases}
          </PDrilldownLink>
        </PDrilldownItem>
      </PDrilldown>
    </>
  );
}
