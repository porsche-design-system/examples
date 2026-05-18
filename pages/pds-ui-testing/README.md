# PDS UI Testing (Next.js)

This package is a minimal technical baseline for Porsche Design System integration.
Each route intentionally contains only a PDS heading and simple links.

## Routes

- `/` server-side redirect to the default locale home (statically exported)
- `/[locale]/` home (full-bleed hero: `public/home-teaser.jpg`, Figma overlay copy + CTA, transparent header aligned to landing template)
- `/[locale]/company/[companySlug]/` footer company placeholders
- `/[locale]/legal/[legalSlug]/` footer legal placeholders

## App router layout

Two root layouts live under `app/`:

- `app/(entry)/` — minimal root for `/` (renders the redirect only)
- `app/[locale]/` — root for all localized routes; sets `<html lang={locale}>`,
  loads PDS partials, and renders the shared footer.

Inside `[locale]/`, route groups switch the header variant without affecting
URLs:

- `app/[locale]/(home)/` — transparent overlay header (only the `/[locale]/` home page)
- `app/[locale]/(default)/` — opaque default header (company / legal pages)

`dynamicParams = false` on `[locale]/layout.tsx` rejects unknown locale segments
at build time.

## Commands

Run from the repository root:

```bash
npm run dev:pds-ui-testing
npm run build:pds-ui-testing
npm run preview:pds-ui-testing
npm run test:a11y:pds-ui-testing
npm run test:e2e:pds-ui-testing
```

## Static export default

Static export is the default mode and is used for simple hosting:

```bash
npm run build:pds-ui-testing
```

`next.config.ts` defaults to:

- `output: 'export'`
- `trailingSlash: true`
- `distDir: 'dist'`

## Switching to SSR mode

To run and build in SSR mode, set:

```bash
NEXT_OUTPUT_MODE=ssr npm run dev:pds-ui-testing
NEXT_OUTPUT_MODE=ssr npm run build:pds-ui-testing
```

When `NEXT_OUTPUT_MODE=ssr`, `next.config.ts` disables static export behavior and uses standard SSR output.

## Optional base path

To serve under a sub-path:

```bash
NEXT_PUBLIC_BASE_PATH=/examples/v4/pds-ui-testing npm run build:pds-ui-testing
```

## Coverage map

The current baseline coverage and route intent are tracked in `docs/component-coverage-map.yml`.
