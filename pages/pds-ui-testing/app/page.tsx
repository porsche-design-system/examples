"use client";

import { PHeading } from "@porsche-design-system/components-react/ssr";
import { useEffect } from "react";
import { defaultLocale } from "@/app/i18n/config";

export default function RootRedirectPage() {
  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
    const path = `${base}/${defaultLocale}/`;
    window.location.replace(`${path}${window.location.search}`);
  }, []);

  return (
    <main data-testid="main-content">
      <PHeading tag="h1">PDS UI Testing</PHeading>
      <p aria-live="polite">Redirecting…</p>
    </main>
  );
}
