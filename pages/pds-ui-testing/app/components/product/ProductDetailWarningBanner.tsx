"use client";

import { useState } from "react";
import { PBanner } from "@porsche-design-system/components-react/ssr";
import type { Dictionary } from "@/app/i18n/get-dictionary";

export type ProductDetailWarningBannerCopy =
  Dictionary["pages"]["productDetail"]["infoBanner"];

type Props = {
  copy: ProductDetailWarningBannerCopy;
  showBanner: boolean;
};

export function ProductDetailWarningBanner({ copy, showBanner }: Props) {
  const [open, setOpen] = useState(showBanner);

  return (
    <PBanner
      description={copy.description}
      dismissButton
      heading={copy.heading}
      headingTag="h2"
      onDismiss={() => setOpen(false)}
      open={open}
      state="info"
    />
  );
}
