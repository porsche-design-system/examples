# Agent instructions — examples by porsche design system

This repository stores **project skills** under [`.agents/skills/`](.agents/skills/). Each skill is a directory with a `SKILL.md` file (YAML frontmatter + instructions). Read the matching `SKILL.md` when the task fits the “Use when” column.

**How skills are added or updated:** Install/sync packs with [`autoskills`](https://www.npmjs.com/package/autoskills) — e.g. `npx autoskills`, or your project wrapper `autoskills.sh` if you keep one in this repository. After changing `.agents/skills/`, commit those changes; the [`.cursor/skills`](.cursor/skills) symlink keeps pointing at `.agents/skills`, so nothing else is required for Cursor.

**Cursor:** Skills are also exposed at [`.cursor/skills`](.cursor/skills) (symlink to `.agents/skills`) so Cursor’s agent can load them automatically.

## Skill index

| Skill                     | Path                                                                                                     | Use when                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Accessibility             | [`.agents/skills/accessibility/SKILL.md`](.agents/skills/accessibility/SKILL.md)                         | a11y audits, WCAG, keyboard/screen reader work                  |
| Frontend design           | [`.agents/skills/frontend-design/SKILL.md`](.agents/skills/frontend-design/SKILL.md)                     | Building or polishing UI, layouts, visual design                |
| Next.js best practices    | [`.agents/skills/next-best-practices/SKILL.md`](.agents/skills/next-best-practices/SKILL.md)             | App Router, RSC boundaries, data fetching, metadata, bundling   |
| Next.js cache components  | [`.agents/skills/next-cache-components/SKILL.md`](.agents/skills/next-cache-components/SKILL.md)         | PPR, `use cache`, cacheLife, cacheTag / updateTag (Next.js 16+) |
| Next.js upgrade           | [`.agents/skills/next-upgrade/SKILL.md`](.agents/skills/next-upgrade/SKILL.md)                           | Version upgrades, codemods, official migration guides           |
| Node.js best practices    | [`.agents/skills/nodejs-best-practices/SKILL.md`](.agents/skills/nodejs-best-practices/SKILL.md)         | General Node.js decisions and principles                        |
| Playwright                | [`.agents/skills/playwright-best-practices/SKILL.md`](.agents/skills/playwright-best-practices/SKILL.md) | E2E, component tests, CI, flakiness, a11y testing               |
| Porsche Design System     | [`.agents/skills/porsche-design-system/SKILL.md`](.agents/skills/porsche-design-system/SKILL.md)         | PDS v4 components, packages, SSR/Next imports, tokens, Tailwind |
| Porsche DS accessibility  | [`.agents/skills/porsche-design-system/accessibility/SKILL.md`](.agents/skills/porsche-design-system/accessibility/SKILL.md) | `aria` prop, hideLabel, Shadow DOM limits, WCAG-focused PDS usage |
| SEO                       | [`.agents/skills/seo/SKILL.md`](.agents/skills/seo/SKILL.md)                                             | Meta tags, structured data, search optimization                 |
| Tailwind CSS patterns     | [`.agents/skills/tailwind-css-patterns/SKILL.md`](.agents/skills/tailwind-css-patterns/SKILL.md)         | Utility styling, responsive layouts, design-system CSS workflow |
| TypeScript advanced types | [`.agents/skills/typescript-advanced-types/SKILL.md`](.agents/skills/typescript-advanced-types/SKILL.md) | Complex generics, conditional/mapped types                      |
| Vite                      | [`.agents/skills/vite/SKILL.md`](.agents/skills/vite/SKILL.md)                                           | vite.config, plugins, SSR, library builds, Vite 8 / Rolldown    |
| Vitest                    | [`.agents/skills/vitest/SKILL.md`](.agents/skills/vitest/SKILL.md)                                       | Unit tests, mocks, coverage, Vitest config                      |

Some skills include extra files (for example `references/` or `AGENTS.md`); treat `SKILL.md` as the entry point.
