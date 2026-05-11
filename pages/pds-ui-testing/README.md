# PDS UI Testing (Next.js)

This package is a minimal technical baseline for Porsche Design System integration.
Each route intentionally contains only a PDS heading and simple links.

## Routes

- `/` redirects to the default locale home
- `/[locale]/` home (full-bleed hero: `public/home-teaser.jpg`, Figma overlay copy + CTA, transparent header aligned to landing template)
- `/[locale]/company/[companySlug]/` footer company placeholders
- `/[locale]/legal/[legalSlug]/` footer legal placeholders

## Commands

Run from the repository root:

```bash
npm run dev:pds-ui-testing
npm run build:pds-ui-testing
npm run preview:pds-ui-testing
npm run test:a11y:pds-ui-testing
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
