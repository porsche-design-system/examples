# Porsche Design System — framework setup cheat sheet

Official step-by-step guides (authoritative): [Developing](https://designsystem.porsche.com/v4/) → choose React, Next.js, Angular, Vue, Vanilla JS, Astro, etc.

## React (Vite)

- `npm install @porsche-design-system/components-react`
- Wrap app with `PorscheDesignSystemProvider` from `@porsche-design-system/components-react`.
- CSS: `@import '@porsche-design-system/components-react';` in main CSS.
- Vite + Lightning CSS: exclude `Features.LightDark` (see main SKILL).
- FOUC: typically `:not(:defined) { visibility: hidden; }` after stylesheet import.
- Partials: `@porsche-design-system/components-react/partials` in `transformIndexHtml` for `<head>`.
- Tailwind: `@import 'tailwindcss';` + `@import '@porsche-design-system/components-react/tailwindcss';`

Guide: [React getting started](https://designsystem.porsche.com/v4/developing/react/getting-started)

## Next.js (App Router)

- `npm install @porsche-design-system/components-react`
- **`PorscheDesignSystemProvider` from `@porsche-design-system/components-react/ssr`** in `app/layout.tsx`.
- Components used in RSC/layout/pages that need SSR: import from **`…/components-react/ssr`** where the docs specify it (e.g. `PWordmark`).
- CSS: `@import '@porsche-design-system/components-react';` in `app/globals.css`.
- `next.config`: `experimental.useLightningcss` + exclude `light-dark` polyfill per docs.
- FOUC: `:not(:defined,[data-ssr]) { visibility: hidden; }`
- Partials in `<head>` with `{getFontLinks({ format: 'jsx' })}`, etc., from `@porsche-design-system/components-react/partials`.

Guide: [Next.js getting started](https://designsystem.porsche.com/v4/developing/next-js/getting-started)

## Angular

- `npm install @porsche-design-system/components-angular`
- Import `PorscheDesignSystemModule` in standalone `imports` or NgModule.
- CSS: `@import '@porsche-design-system/components-angular/index.css';`
- FOUC: scoped `:is(p-accordion, p-banner, …):not(:defined)` (full tag list in docs).
- Partials: often a **`prebuild.mjs`** generates `.generated/index.html`; point `angular.json` `index` to the generated file; run `prebuild` before `ng serve` / `ng build`.
- Tailwind: PostCSS `@tailwindcss/postcss` + `@import '@porsche-design-system/components-angular/tailwindcss';`

Guide: [Angular getting started](https://designsystem.porsche.com/v4/developing/angular/getting-started)

## Vue 3

- `npm install @porsche-design-system/components-vue`
- Wrap with `PorscheDesignSystemProvider` from `@porsche-design-system/components-vue`.
- CSS: `@import '@porsche-design-system/components-vue';`
- Same Vite + Lightning + FOUC + partials pattern as React.
- Tailwind: `@import '@porsche-design-system/components-vue/tailwindcss';`

Guide: [Vue getting started](https://designsystem.porsche.com/v4/developing/vue/getting-started)

## Vanilla JS (`components-js`)

- `npm install @porsche-design-system/components-js`
- Inject **`getLoaderScript()`** before `</body>` via Vite `transformIndexHtml`.
- CSS: `@import '@porsche-design-system/components-js';`
- Partials in `<head>` + loader in `<body>` for fonts/icons/chunks/meta.

Guide: [Vanilla JS getting started](https://designsystem.porsche.com/v4/developing/vanilla-js/getting-started)

## Astro

- Uses **`@porsche-design-system/components-js`** (Vue optional via `@astrojs/vue`).
- Layout: `Fragment set:html={getLoaderScript()}` in `<body>`; partials in `<head>` with `set:html`.
- `astro.config` `vite.css` Lightning exclude for `light-dark`; Tailwind via `@tailwindcss/vite`.
- **Vue + Astro**: `isCustomElement: (tag) => tag.startsWith('p-')` in Vue integration `compilerOptions`.

Guide: [Astro getting started](https://designsystem.porsche.com/v4/developing/astro/getting-started)

## China / CDN

If the audience is primarily in China, the docs describe a **`/cn` stylesheet import** variant—see [China CDN](https://designsystem.porsche.com/v4/must-know/performance/cdn/#china-cdn).
