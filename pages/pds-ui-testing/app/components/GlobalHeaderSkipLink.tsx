"use client";

import type { MouseEvent } from "react";
import { PLinkPure } from "@porsche-design-system/components-react/ssr";
import {
  PAGE_HEADING_ID,
  skipToPageHeading,
} from "@/app/lib/skip-to-page-heading";

type Props = {
  label: string;
  menuButtonClassName?: string;
};

export function GlobalHeaderSkipLink({ label, menuButtonClassName }: Props) {
  const className = menuButtonClassName
    ? `skip-to-content ${menuButtonClassName}`
    : "skip-to-content";

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    skipToPageHeading();
  };

  return (
    <PLinkPure className={className} icon="none">
      <a href={`#${PAGE_HEADING_ID}`} onClick={handleClick}>
        {label}
      </a>
    </PLinkPure>
  );
}
