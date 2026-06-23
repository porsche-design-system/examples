"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import {
  PAccordion,
  PAiTag,
  PHeading,
  PText,
  PTextList,
  PTextListItem,
  type AccordionUpdateEventDetail,
} from "@porsche-design-system/components-react/ssr";
import type { CatalogProduct } from "@/app/data/get-catalog";
import type { Locale } from "@/app/i18n/config";
import type { Dictionary } from "@/app/i18n/get-dictionary";

export type ProductDetailSectionsCopy = Dictionary["pages"]["productDetail"];

type PanelKey =
  | "description"
  | "dimensionsAndWeight"
  | "materialAndCare"
  | "generalCharacteristics";

type Props = {
  product: CatalogProduct;
  copy: ProductDetailSectionsCopy;
  locale: Locale;
};

function LabeledField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-static-xs">
      <PText size="small" weight="semibold">
        {label}
      </PText>
      <PText>{value}</PText>
    </div>
  );
}

export function ProductDetailSections({ product, copy, locale }: Props) {
  const { details } = product;
  const [openPanels, setOpenPanels] = useState<Record<PanelKey, boolean>>({
    description: false,
    dimensionsAndWeight: false,
    materialAndCare: false,
    generalCharacteristics: false,
  });

  const togglePanel = (key: PanelKey, open: boolean) => {
    setOpenPanels((prev) => ({ ...prev, [key]: open }));
  };

  const panels: { key: PanelKey; title: string; content: ReactNode }[] = [
    {
      key: "description",
      title: copy.detailsSections.description,
      content: (
        <div className="flex flex-col gap-static-sm">
          {details.description.paragraphs.map((paragraph) => (
            <PText key={paragraph}>{paragraph}</PText>
          ))}
          {details.description.bullets &&
          details.description.bullets.length > 0 ? (
            <PTextList>
              {details.description.bullets.map((bullet) => (
                <PTextListItem key={bullet}>{bullet}</PTextListItem>
              ))}
            </PTextList>
          ) : null}
          <PText color="contrast-medium" size="small">
            {copy.detailsFields.itemNumber}: {product.sku}
          </PText>
        </div>
      ),
    },
    {
      key: "dimensionsAndWeight",
      title: copy.detailsSections.dimensionsAndWeight,
      content: (
        <div className="flex flex-col gap-static-md">
          <LabeledField
            label={copy.detailsFields.dimensions}
            value={details.dimensionsAndWeight.dimensions}
          />
          <LabeledField
            label={copy.detailsFields.weight}
            value={details.dimensionsAndWeight.weight}
          />
        </div>
      ),
    },
    {
      key: "materialAndCare",
      title: copy.detailsSections.materialAndCare,
      content: (
        <div className="flex flex-col gap-static-md">
          <LabeledField
            label={copy.detailsFields.material}
            value={details.materialAndCare.material}
          />
          <LabeledField
            label={copy.detailsFields.careInstructions}
            value={details.materialAndCare.careInstructions}
          />
        </div>
      ),
    },
    {
      key: "generalCharacteristics",
      title: copy.detailsSections.generalCharacteristics,
      content: (
        <div className="flex flex-col gap-static-md">
          {details.generalCharacteristics.map(({ label, value }) => (
            <LabeledField key={label} label={label} value={value} />
          ))}
          {details.info ? (
            <div className="flex flex-col gap-static-xs">
              <PText size="small" weight="semibold">
                {copy.detailsFields.info}
              </PText>
              <PText size="small">{details.info}</PText>
            </div>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-static-sm">
      {panels.map(({ key, title, content }) => (
        <PAccordion
          alignMarker="end"
          background="surface"
          key={key}
          onUpdate={(event: CustomEvent<AccordionUpdateEventDetail>) =>
            togglePanel(key, event.detail.open)
          }
          open={openPanels[key]}
        >
          <PHeading slot="summary" size="small" tag="h3" weight="semibold">
            {title}
          </PHeading>
          {key === "description" && (
            <PAiTag
              slot="summary-after"
              locale={locale === "en" ? "en_US" : "de_DE"}
            />
          )}
          {content}
        </PAccordion>
      ))}
    </div>
  );
}
