# A11y UI Testing (Next.js)

This package is a minimal technical baseline for Porsche Design System integration.
Each route intentionally contains only a PDS heading and simple links.

## Routes

- `/` home
- `/overview` overview
- `/detail/[id]` detail
- `/checkout` checkout

## Commands

Run from the repository root:

```bash
npm run dev:a11y-ui-testing
npm run build:a11y-ui-testing
npm run preview:a11y-ui-testing
npm run test:a11y:a11y-ui-testing
```

## Static export default

Static export is the default mode and is used for simple hosting:

```bash
npm run build:a11y-ui-testing
```

`next.config.ts` defaults to:

- `output: 'export'`
- `trailingSlash: true`
- `distDir: 'dist'`

## Switching to SSR mode

To run and build in SSR mode, set:

```bash
NEXT_OUTPUT_MODE=ssr npm run dev:a11y-ui-testing
NEXT_OUTPUT_MODE=ssr npm run build:a11y-ui-testing
```

When `NEXT_OUTPUT_MODE=ssr`, `next.config.ts` disables static export behavior and uses standard SSR output.

## Optional base path

To serve under a sub-path:

```bash
NEXT_PUBLIC_BASE_PATH=/examples/v4/a11y-ui-testing npm run build:a11y-ui-testing
```

## Coverage map

The current baseline coverage and route intent are tracked in `docs/component-coverage-map.yml`.
