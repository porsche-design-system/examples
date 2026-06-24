# PDS UI Testing (Next.js)

Demo shop and technical baseline for Porsche Design System integration with Next.js App Router, static export, and i18n. It exercises catalog browsing, product detail, session favorites, header search, a multi-step inquiry flyout, and footer-linked newsletter and contact demo forms.

## Routes

- `/` — server-side redirect to the default locale home (statically exported)
- `/[locale]/` — home (hero, lifestyle tiles, trending products; transparent header)
- `/[locale]/products/` — product catalog (filters, sort, favorites view)
- `/[locale]/products/[productSlug]/` — product detail (inquiry flyout, sizes for apparel)
- `/[locale]/newsletter/` — newsletter subscription (validated demo form, dummy submit result)
- `/[locale]/contact/` — contact form (validated demo form, dummy submit result)
- `/[locale]/company/[companySlug]/` — footer company placeholders
- `/[locale]/legal/[legalSlug]/` — footer legal placeholders

Locales: `en` (default), `de`.

## App structure

```
app/
  (entry)/              # Minimal root for `/` redirect only
  [locale]/             # Locale shell: <html>, PDS provider, footer, favorites
    (home)/             # Transparent header (home only)
    (default)/          # Opaque header (products, newsletter, contact, company, legal)
  components/
    header/             # GlobalHeader, skip link, nav, search, favorites link
    catalog/            # Catalog browser, grid, products index shell
    product/            # Detail price, inquiry flyout, size tools
    favorites/          # Provider, toasts, favorite product tiles
    home/               # Hero, landing sections
    footer/             # GlobalFooter, footer placeholders, language switch
    newsletter/         # Newsletter subscription form
    contact/            # Contact form
  data/                 # Catalog JSON and helpers
  hooks/                # Client hooks (e.g. catalog URL query sync)
  i18n/                 # Locale config, dictionaries, href builders
  lib/                  # Pure logic (query, search, form validation, a11y scroll)
```

### Naming conventions

- **PascalCase** `.tsx` — React components under `app/components/<feature>/`
- **kebab-case** `.ts` — utilities in `app/lib/`, `app/data/`, `app/i18n/`
- **`use-*.ts`** — client hooks in `app/hooks/`

### App router layout

Two root layouts live under `app/` (no single `app/layout.tsx`):

- `app/(entry)/` — minimal root for `/` (renders the redirect only)
- `app/[locale]/` — root for all localized routes; sets `<html lang={locale}>`, loads PDS partials, and renders the shared footer

Inside `[locale]/`, route groups switch the header variant without affecting URLs:

- `app/[locale]/(home)/` — transparent overlay header (only the `/[locale]/` home page)
- `app/[locale]/(default)/` — opaque default header (products, newsletter, contact, company, legal)

`dynamicParams = false` on `[locale]/layout.tsx` rejects unknown locale segments at build time.

`<base href>` in the locale layout supports optional `NEXT_PUBLIC_BASE_PATH`; the skip link uses programmatic focus (`app/lib/skip-to-page-heading.ts`) because hash navigation is unreliable with a base URL.

## Commands

Run from the repository root:

```bash
npm run dev:pds-ui-testing
npm run build:pds-ui-testing
npm run preview:pds-ui-testing
npm run test:unit:pds-ui-testing
npm run test:e2e:pds-ui-testing
npm run test:a11y:pds-ui-testing
```

From this package directory:

```bash
npm run test:unit
npm run test:e2e
npm run test:a11y
```

### Testing

| Layer | Tool                                          | What it covers                                                                                                                                                              |
| ----- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit  | Vitest + Testing Library                      | `app/lib/` (catalog, search, inquiry/newsletter/contact validation), i18n hrefs, favorites storage/provider, `useCatalogQueryParams`, `ProductDetailPrice`, skip-to-heading |
| E2E   | Playwright on static `dist` (port 3456)       | Filter chip dismiss, header product search, session favorites                                                                                                               |
| A11y  | Playwright + axe on static `dist` (port 3456) | All `page.tsx` routes (discovered from `app/`), zero axe violations; Chrome + mobile                                                                                        |

E2E and a11y both build with `NEXT_PUBLIC_BASE_PATH=` cleared so client hydration matches URLs under test.

CI runs all three in the **Contribution** workflow (`.github/workflows/contribution.yml`).

#### Manual accessibility / usability sessions

For moderated testing with assistive technology users (screen readers, keyboard-only, zoom), use **[ACCESSIBILITY-TEST-PLAN.md](./ACCESSIBILITY-TEST-PLAN.md)**. It describes session goals, demo-app limitations, step-by-step flows for every page area and PDS component, and how to record findings. Automated axe tests complement but do not replace that plan.

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
