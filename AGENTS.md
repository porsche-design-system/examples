# AGENTS.md

Guidance for AI coding assistants working in this repository. For human-oriented setup
instructions see [`README.md`](./README.md).

## Project Overview

This is the **Examples** repository by the [Porsche Design System](https://designsystem.porsche.com/)
team. It showcases JS framework integration examples, reusable Patterns and Templates, all built with
[Porsche Design System v4](https://designsystem.porsche.com/v3/components/introduction) components,
[Tailwind CSS](https://designsystem.porsche.com/v3/tailwindcss/introduction) and aligned with the
[Porsche Corporate Identity](https://brand.porsche.com/). UIs must remain
[WCAG 2.2 (AA)](https://www.w3.org/TR/WCAG22/) compliant.

It is an **npm workspaces monorepo**. Each example is an independent workspace with its own
`package.json`, build setup and tests.

## Repository Structure

```
examples/
├── frameworks/          # Framework integration examples (one workspace each)
│   ├── angular/         # Angular
│   ├── astro/           # Astro
│   ├── next-js/         # Next.js
│   ├── react/           # React (Vite)
│   ├── react-router/    # React Router
│   ├── vanilla-js/      # Vanilla JS (Vite)
│   └── vue/             # Vue (Vite)
├── patterns/            # Reusable UI patterns (header, footer) — workspace
├── templates/           # Full-page templates (landing-page, admin-panel) — workspace
├── biome.json           # Formatter + linter config (shared)
├── docker-compose.yml   # Playwright container for consistent test runs
├── docker.sh            # Wrapper to run any command inside Docker
└── package.json         # Root workspace + aggregated scripts
```

Workspaces are declared in the root [`package.json`](./package.json) as `frameworks/*`, `patterns`
and `templates`. Each workspace is named `@porsche-design-system/<name>`.

## Commands

Run all commands from the repository root. Each `:<name>` suffix targets a single workspace.

```bash
npm install                  # Install all workspace dependencies

npm run dev:<name>           # Start dev server (e.g. dev:react, dev:patterns)
npm run build:<name>         # Build a workspace (or `npm run build` for all)
npm run preview:<name>       # Preview a production build

npm run format               # Biome format
npm run lint                 # Biome lint

npm run test:e2e:<name>      # Playwright e2e (all framework + patterns)
npm run test:a11y:patterns   # Accessibility tests (patterns only)
npm run test:vrt:patterns    # Visual regression tests (patterns only)
```

`<name>` is one of: `angular`, `astro`, `next-js`, `react`, `react-router`, `vanilla-js`, `vue`,
`patterns`, `templates`.

### Docker

Any command can run inside a Playwright container for reproducible results — required for visual
regression testing:

```bash
./docker.sh npm install
./docker.sh npm run test:vrt:patterns
```

### Dependency management (syncpack)

```bash
npm run npm:lint             # Check version consistency across workspaces
npm run npm:lint:fix         # Fix mismatches
npm run npm:outdated         # Check outdated deps
```

## Toolchain

- **Node.js / npm**: pinned via [Volta](https://volta.sh) (`node` 24, `npm` 11). Workspaces extend
  the root Volta config.
- **Bundlers**: Vite (react, vanilla-js, vue, patterns, templates), plus framework-native tooling
  for Angular, Astro, Next.js and React Router.
- **Testing**: [Playwright](https://playwright.dev/) with configs under each
  `tests/{e2e,a11y,vrt}/config/`.
- **Agent Skills**: version-matched Porsche Design System skills are linked into `.agents/skills`
  as relative symlinks pointing into `node_modules`. Prefer them over external documentation, and
  pick the one matching the workspace you edit (`pds-knowledge-js`, `-react`, `-vue`, `-angular`).

## Code Style & Conventions

Formatting and linting are enforced by **Biome** ([`biome.json`](./biome.json)). Run `npm run format`
and `npm run lint` before finishing. Key rules:

- 2-space indentation, max line width **120**, LF line endings.
- **Single quotes** for JS/TS, **double quotes** for JSX attributes and CSS.
- Always use **semicolons**; trailing commas `es5`; always wrap arrow params.
- `noForEach` is an **error** — use `for...of` instead of `Array.prototype.forEach`.
- Imports are auto-organized on save; keep them sorted.
- **Markdown** files (`*.md`, `*.mdx`) are formatted with **Prettier**, not Biome.

### Conventions

- Keep each example self-contained; don't introduce cross-workspace imports.
- Match the existing patterns of the workspace you are editing (component structure, file naming,
  test layout) rather than introducing new ones.
- Preserve accessibility (WCAG 2.2 AA) when changing markup.

