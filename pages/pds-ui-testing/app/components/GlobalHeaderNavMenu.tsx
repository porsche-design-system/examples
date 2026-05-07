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

const SHOP_NAV_DRILLDOWN_ID = "shop-navigation-drilldown";

export function GlobalHeaderNavMenu() {
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
        Menu
      </PButtonPure>
      <PDrilldown
        activeIdentifier={activeIdentifier}
        aria={{ "aria-label": "Shop categories" }}
        id={SHOP_NAV_DRILLDOWN_ID}
        onDismiss={handleDismiss}
        onUpdate={handleUpdate}
        open={open}
      >
        <PDrilldownItem identifier="women" label="Women">
          <PDrilldownLink href="#shop/women">View all Women</PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="men" label="Men">
          <PDrilldownLink href="#shop/men">View all Men</PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="kids" label="Kids">
          <PDrilldownLink href="#shop/kids">View all Kids</PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="accessories" label="Accessories">
          <PDrilldownLink href="#shop/accessories/clothing">
            Clothing
          </PDrilldownLink>
          <PDrilldownLink href="#shop/accessories/charging">
            Charging Hardware
          </PDrilldownLink>
          <PDrilldownLink href="#shop/accessories">
            View all products
          </PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="model-cars" label="Model Cars">
          <PDrilldownLink href="#shop/model-cars">
            View all Model Cars
          </PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem
          identifier="porsche-originals"
          label="Porsche Originals"
        >
          <PDrilldownLink href="#shop/porsche-originals">
            View all Porsche Originals
          </PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="porsche-design" label="Porsche Design">
          <PDrilldownLink href="#shop/porsche-design">
            View all Porsche Design
          </PDrilldownLink>
        </PDrilldownItem>
        <PDrilldownItem identifier="new-releases" label="New releases">
          <PDrilldownLink href="#shop/new-releases">
            View all new releases
          </PDrilldownLink>
        </PDrilldownItem>
      </PDrilldown>
    </>
  );
}
