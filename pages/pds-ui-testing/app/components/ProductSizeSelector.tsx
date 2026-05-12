"use client";

import { useState } from "react";
import {
  PSegmentedControl,
  PSegmentedControlItem,
} from "@porsche-design-system/components-react/ssr";

type ProductSizeSelectorProps = {
  label: string;
};

const apparelSizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export function ProductSizeSelector({
  label,
}: ProductSizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const selectedSizeValue = selectedSize ?? undefined;

  return (
    <div className="grid gap-static-sm">
      <PSegmentedControl
        columns={{ base: 3, s: 6 }}
        label={label}
        name="product-size"
        onChange={(event) => setSelectedSize(String(event.detail.value))}
        value={selectedSizeValue}
      >
        {apparelSizes.map((size) => (
          <PSegmentedControlItem key={size} label={size} value={size} />
        ))}
      </PSegmentedControl>
    </div>
  );
}
