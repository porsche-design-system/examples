"use client";

import { useState } from "react";
import { PBanner } from "@porsche-design-system/components-react/ssr";
import type { Dictionary } from "@/app/i18n/get-dictionary";

export type ProductDetailWarningBannerCopy =
  Dictionary["pages"]["productDetail"]["warningBanner"];

type Props = {
  copy: ProductDetailWarningBannerCopy;
};

export function ProductDetailWarningBanner({ copy }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <PBanner
      description={copy.description}
      dismissButton
      heading={copy.heading}
      headingTag="h2"
      onDismiss={() => setOpen(false)}
      open={open}
      state="warning"
    />
  );
}
