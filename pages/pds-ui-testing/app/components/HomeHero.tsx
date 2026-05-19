"use client";

import Image from "next/image";
import { useState } from "react";
import {
  PButton,
  PHeading,
  PLink,
  PModal,
  PText,
  PTextList,
  PTextListItem,
} from "@porsche-design-system/components-react/ssr";
import { PAGE_HEADING_ID } from "@/app/lib/skip-to-page-heading";
import type { Dictionary } from "@/app/i18n/get-dictionary";
import { appHref } from "../i18n/href";

type HeroModalCopy = Dictionary["pages"]["home"]["heroModal"];

type Props = {
  alt: string;
  /** Multiline hero title (use `\n` for line breaks). */
  heading: string;
  ctaLabel: string;
  modal: HeroModalCopy;
  productsHref: string;
};

/**
 * Home hero: teaser image (Figma 1:8389) with gradients and overlay copy + CTA (Figma 1:8576),
 * aligned to landing-page template patterns.
 */
export function HomeHero({
  alt,
  heading,
  ctaLabel,
  modal,
  productsHref,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      className="scheme-dark z-0 rounded-b-4xl h-[clamp(480px,80vh,1000px)] col-full sm:col-wide grid grid-cols-subgrid items-end relative before:absolute before:inset-[0_0_80%_0] before:z-1 before:pointer-events-none before:bg-linear-to-b before:from-canvas before:to-transparent after:absolute after:inset-[50%_0_0_0] after:z-1 after:pointer-events-none after:bg-linear-to-t after:from-canvas after:to-transparent after:rounded-b-4xl"
      aria-labelledby={PAGE_HEADING_ID}
    >
      {/* Root-absolute `public/` path; Next `Image` applies `basePath`. Avoid `./` — it resolves under `/en/` and 404s. */}
      <Image
        alt={alt}
        className="object-cover rounded-b-4xl"
        fill
        priority
        sizes="(max-width: 1920px) 100vw, 1920px"
        src={appHref("/home-teaser.jpg")}
      />
      <div className="z-2 col-extended row-span-full mb-fluid-xl flex flex-col gap-fluid-md items-start">
        <PHeading
          className="whitespace-pre-line text-start"
          color="primary"
          id={PAGE_HEADING_ID}
          size="x-large"
          tag="h1"
          weight="semibold"
        >
          {heading}
        </PHeading>
        <PButton
          type="button"
          variant="primary"
          aria={{ "aria-haspopup": "dialog" }}
          onClick={() => setIsModalOpen(true)}
        >
          {ctaLabel}
        </PButton>
        <PModal
          aria={{ "aria-label": modal.title }}
          onDismiss={() => setIsModalOpen(false)}
          open={isModalOpen}
        >
          <div className="grid gap-fluid-md">
            <div className="grid gap-static-sm">
              <PText color="contrast-medium" size="small" weight="semibold">
                {modal.eyebrow}
              </PText>
              <PHeading size="2xl" tag="h2">
                {modal.title}
              </PHeading>
              <PText>{modal.intro}</PText>
            </div>
            <PTextList type="numbered">
              {modal.highlights.map((highlight) => (
                <PTextListItem key={highlight}>{highlight}</PTextListItem>
              ))}
            </PTextList>
            <PText color="contrast-medium">{modal.outro}</PText>
            <div>
              <PLink
                href={productsHref}
                variant="secondary"
              >
                {modal.close}
              </PLink>
            </div>
          </div>
        </PModal>
      </div>
    </section>
  );
}
