---
name: porsche-design-system
description: >-
  Build and style UIs with Porsche Design System (PDS) v4—Web Components, framework
  packages, global stylesheet, partials, Tailwind theme, SSR/Next.js import paths, and
  safe customization. Use when the user works with PDS, @porsche-design-system, p-*
  components, PButton/PWordmark-style React wrappers, or designsystem.porsche.com.
---

# Porsche Design System (v4)

Official docs: [Porsche Design System v4](https://designsystem.porsche.com/v4/). Source: [porsche-design-system on GitHub (v4 branch)](https://github.com/porsche-design-system/porsche-design-system/tree/v4).

## Mental model

- **Coded components are the source of truth**; Figma follows implementation.
- **Stencil Web Components** (`p-*` custom elements) ship inside **framework-specific npm packages** with TypeScript and SSR support.
- Prefer the **public API**: component **properties**, **slots**, and **documented CSS variables**. Do **not** rely on shadow-DOM internals or undocumented overrides—they can break on upgrade.

## Packages (install one that matches the stack)

| Stack    | npm package                                  |
| -------- | -------------------------------------------- |
| React    | `@porsche-design-system/components-react`    |
| Next.js  | `@porsche-design-system/components-react` (+ `/ssr` imports—see below) |
| Angular  | `@porsche-design-system/components-angular`  |
| Vue      | `@porsche-design-system/components-vue`      |
| Vanilla / Astro / JS-first | `@porsche-design-system/components-js` |

Version line in docs is typically **v4** (e.g. React + Next with **React 19**, **Tailwind CSS 4**—align peer deps with the [getting-started](https://designsystem.porsche.com/v4/) page for your framework).

## Non-negotiable integration steps

1. **Global stylesheet** — One import in the app’s main CSS so tokens, fonts, and base styles apply. Paths differ slightly by package (e.g. Angular uses `…/index.css`; follow the framework guide).
2. **`light-dark()` / Lightning CSS** — Disable Lightning’s broken `light-dark()` polyfill so **color tokens** render correctly ([lightning-css issue context](https://github.com/porsche-design-system/porsche-design-system/issues/4257)): Vite uses `lightningcss.exclude: Features.LightDark`; Next uses `experimental.lightningCssFeatures` to exclude `'light-dark'`. See [color scheme / Lightning CSS](https://designsystem.porsche.com/v4/stylesheets/color-scheme/introduction/#lightning-css-bug).
3. **FOUC** — Hide custom elements until defined/hydrated. Use **framework-specific** selectors from the docs (plain `:not(:defined)`, Next adds `[data-ssr]`, Angular often uses a scoped `:is(p-button, …)` list). Details: [Initialization (Vanilla JS)](https://designsystem.porsche.com/v4/must-know/initialization/vanilla-js/#preparation).
4. **Provider / module** — React and Vue wrap the app with `PorscheDesignSystemProvider`. Angular imports `PorscheDesignSystemModule`. Vanilla/Astro use the **loader script** from partials in HTML.

## Next.js vs React (critical)

- In **Next.js (App Router)**, import **`PorscheDesignSystemProvider` and components from `@porsche-design-system/components-react/ssr`**, not the default package entry—see [Next.js getting started](https://designsystem.porsche.com/v4/developing/next-js/getting-started).
- Configure **partials** in `layout.tsx` `head` using the **JSX** format helpers (`format: 'jsx'` where applicable).

## Performance (recommended)

Use **partials** to inject preload links for fonts, icons, component chunks, meta/icons, and (where relevant) the **loader script**: `getFontLinks`, `getIconLinks`, `getComponentChunkLinks`, `getMetaTagsAndIconLinks`, `getLoaderScript` from `…/partials`. Wire them via Vite `transformIndexHtml`, Next `layout`, Angular `prebuild` → generated `index.html`, etc. Overview: [Partials introduction](https://designsystem.porsche.com/v4/partials/introduction/).

## Tailwind + PDS

After the PDS stylesheet import, add Tailwind v4 and the **PDS Tailwind theme** for that package, e.g.:

```css
@import 'tailwindcss';
@import '@porsche-design-system/components-react/tailwindcss';
```

(Adjust the second line’s package path to match `components-angular`, `components-vue`, or `components-js`.) Token-backed utilities (e.g. `gap-fluid-md`, `bg-surface`, `prose-heading-4xl`) come from this theme—see [Tailwind CSS theme](https://designsystem.porsche.com/v4/tailwindcss/introduction/).

## Components and APIs

- **HTML/Web**: tags like `p-button`, `p-wordmark`, `p-accordion`, …
- **React**: PascalCase wrappers (e.g. `PWordmark`, `PButton`) from the same package; exact exports follow package typings.
- **Props / slots / events**: authoritative tables per component—use the live docs or the [components overview](https://designsystem.porsche.com/v4/components/introduction). Icons use a large **enum** of icon names on components like `p-button`.
- Legend in docs: **experimental**, **deprecated**, **breakpoint-customizable** props—check before using 🧪/🚫 items in production.

## Customization

From product FAQ (docs home): customize via **public** props, slots, and **CSS variables**; avoid overriding internals. For fully custom UI, prefer **Tailwind** (recommended), or SCSS / Emotion / Vanilla Extract **styling solutions** documented under **Tokens → Styling** in the sidebar.

## Where to look in this repo vs upstream

- **Examples** in this workspace may illustrate usage; **behavior and APIs** are defined by the published packages and [designsystem.porsche.com/v4](https://designsystem.porsche.com/v4/).
- For bugs, roadmap, or source: [GitHub repository](https://github.com/porsche-design-system/porsche-design-system/tree/v4).

## Additional reference

Condensed **per-framework setup** (install lines, imports, SSR, Angular index path): [references/framework-setup.md](references/framework-setup.md).

**Accessibility / `aria` props**: [accessibility/SKILL.md](accessibility/SKILL.md).
