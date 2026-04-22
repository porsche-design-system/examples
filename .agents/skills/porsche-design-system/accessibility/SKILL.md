---
name: porsche-design-system-accessibility
description: >-
  Use Porsche Design System components accessibly `aria` prop, labeling
  icon-only controls, keyboard behavior, Shadow DOM / IDREF limits, and alignment with
  PDS WCAG 2.2 AA testing. Use with PDS when setting aria-label, hideLabel, dialogs,
  flyouts, or auditing PDS markup; combine with generic WCAG skill for page-level audits.
---

# Porsche Design System — accessibility & `aria`

Use this skill **together with** [`porsche-design-system`](../SKILL.md) for setup and [`accessibility`](../../accessibility/SKILL.md) for general WCAG audits. Official overview: [Accessibility introduction](https://designsystem.porsche.com/v4/must-know/accessibility/introduction/).

## What PDS guarantees

- Components target **WCAG 2.2 AA** with automated (**axe-core**), snapshot/a11y tree checks, high-contrast and **200% text-zoom** VRT, RTL, plus manual keyboard and screen-reader passes ([Accessibility introduction](https://designsystem.porsche.com/v4/must-know/accessibility/introduction/)).
- **Keyboard**: interactive components document expected keys per component (see each component’s **Accessibility** page in the storefront, e.g. Tab/Enter/Space for buttons and links).

## The `aria` component prop

Many interactive components expose an **`aria` property**: an **object** whose keys are **ARIA attribute names** (strings with hyphens). Use it to pass **supplemental** semantics that depend on your content—not to replace visible labels when a clear text label exists.

**React / JSX** (quote hyphenated keys):

```tsx
<PButton aria={{ 'aria-label': 'Submit order' }}>Submit</PButton>

<PButton aria={{ 'aria-haspopup': 'dialog' }}>Open</PButton>
```

**Typical externally supplied keys** (availability varies by component—confirm on the component page):

| Key                | Purpose                                                      |
| ------------------ | ------------------------------------------------------------ |
| `aria-label`       | Accessible name when visible text is missing or insufficient |
| `aria-description` | Extra description for AT                                     |
| `aria-expanded`    | Expanded/collapsed for disclosure-like controls              |
| `aria-pressed`     | Toggle button state                                          |
| `aria-haspopup`    | Popup type (e.g. `'dialog'`) for triggers                    |
| `aria-current`     | Current item in nav (e.g. links)                             |

Example from docs patterns: drilldown/flyout-style triggers may use:

```tsx
aria={{ 'aria-haspopup': 'dialog' }}
```

**Angular** (binding the same object):

```html
<p-button [aria]="{ 'aria-label': 'Save draft' }">Save</p-button>
```

**Vue** (components from `@porsche-design-system/components-vue`):

```vue
<PButton :aria="{ 'aria-label': 'Save draft' }">Save</PButton>
```

Use the hyphenated **ARIA keys as object properties** (quoted in JS/TS); exact typings ship with each framework package.

## Labelling and `hideLabel`

- If visible text **does not** explain the action (e.g. vague “Details”, icon-only controls), set a **concise** `aria-label` (or improve visible copy). Prefer meaningful link/button text over generic phrases ([Link accessibility guidance](https://designsystem.porsche.com/v4/components/link/accessibility/) pattern).
- **`hideLabel`** (where offered): hides the visible label but **does not** remove the need for an accessible name—pair with **`aria-label`** / full visible context so icon-only buttons and compact controls remain perceivable.

## Internal vs external ARIA

Components **manage** some attributes internally (examples from Button/Link docs): `aria-disabled` when disabled, loading announcements, **`aria-hidden="true"`** on decorative icons so the icon is not double-announced. Pass **`aria`** only for **your** labelling/state needs; avoid fighting internal roles without checking the component’s Accessibility tab.

## Shadow DOM limitations (critical)

Because of **scoped Shadow DOM**, several **ID reference** relationships **cannot** be wired the usual HTML way. Attributes such as **`aria-labelledby`**, **`aria-describedby`**, **`aria-owns`**, **`aria-controls`**, and **`aria-activedescendant`** are **not supported** in the documented Button Pure pattern—the same class of limitation applies broadly to custom elements ([Button Pure accessibility](https://designsystem.porsche.com/v4/components/button-pure/accessibility/), [Accessibility introduction](https://designsystem.porsche.com/v4/must-know/accessibility/introduction/) on Web Components and **IDRef**).

**Practical implication**: prefer **`aria-label`** / **`aria-description`** on the component itself, visible text in light DOM slots, or restructuring the UI—not ID-based wiring across shadow boundaries.

The docs also note ongoing standards work (**Accessibility Object Model**) that may improve JS-driven a11y for Web Components over time.

## Page-level requirements

PDS relies on token/theming that respects **`color-scheme`**, **`dir`** on `<html>` for RTL, and layouts that survive **200% zoom**—configure globals as in the main PDS integration guides ([`porsche-design-system`](../SKILL.md)).

## Component-level truth

Authoritative props, slots, events, and **per-component ARIA tables** live in the docs: start from [Components introduction](https://designsystem.porsche.com/v4/components/introduction) or the component’s **Accessibility** page for the tag you use (`p-button`, `p-link`, …).

## Issues

Report suspected defects via [Bug report](https://designsystem.porsche.com/v4/help/bug-report/) (linked from the accessibility overview).
