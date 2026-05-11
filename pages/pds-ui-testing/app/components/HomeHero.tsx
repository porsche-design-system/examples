import Image from "next/image";
import { PButton, PHeading } from "@porsche-design-system/components-react/ssr";

type Props = {
  alt: string;
  /** Multiline hero title (use `\n` for line breaks). */
  heading: string;
  ctaLabel: string;
};

/**
 * Home hero: teaser image (Figma 1:8389) with gradients and overlay copy + CTA (Figma 1:8576),
 * aligned to landing-page template patterns.
 */
export function HomeHero({ alt, heading, ctaLabel }: Props) {
  return (
    <section
      className="scheme-dark z-0 rounded-b-4xl h-[clamp(480px,80vh,1000px)] col-full sm:col-wide grid grid-cols-subgrid items-end relative before:absolute before:inset-[0_0_80%_0] before:z-1 before:pointer-events-none before:bg-linear-to-b before:from-canvas before:to-transparent after:absolute after:inset-[50%_0_0_0] after:z-1 after:pointer-events-none after:bg-linear-to-t after:from-canvas after:to-transparent after:rounded-b-4xl"
      aria-labelledby="heading-section-1"
    >
      <Image
        alt={alt}
        className="object-cover rounded-b-4xl"
        fill
        priority
        sizes="(max-width: 1920px) 100vw, 1920px"
        src="./home-teaser.jpg"
      />
      <div className="z-2 col-extended row-span-full mb-fluid-xl flex flex-col gap-fluid-md items-start">
        <PHeading
          className="whitespace-pre-line text-start"
          color="primary"
          id="home-hero-heading"
          size="x-large"
          tag="h1"
          weight="semibold"
        >
          {heading}
        </PHeading>
        <PButton type="button" variant="primary">
          {ctaLabel}
        </PButton>
      </div>
    </section>
  );
}
