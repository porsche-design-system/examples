# Accessibility test plan — PDS UI Testing

Handover document for moderated usability sessions with people who use assistive technology. The goal is to evaluate **Porsche Design System (PDS) components** in realistic page contexts, not to certify a production shop.

---

## 1. Purpose and desired outcomes

### Why we run these sessions

This application is a **controlled demo** built to surface PDS patterns (navigation, tiles, forms, overlays, tables, carousels, and more) in a shop-like flow. Automated checks (axe) already run in CI; **this plan covers qualitative testing with real users** — especially screen reader, keyboard-only, and zoom/magnification users.

### What “success” looks like

After a session, the team should be able to answer:

| Question | Example evidence |
|----------|------------------|
| Can users **orient** on each page (landmarks, headings, page title)? | Participant finds the main heading without sighted help |
| Can users **complete core tasks** (browse, filter, open a product, start an inquiry)? | Task completed within a reasonable time; no dead ends |
| Are **PDS components** announced and operable as expected? | Radio groups, flyouts, steppers, tiles behave predictably in NVDA/VoiceOver |
| Where do users **stall, misinterpret, or fail**? | Timestamped notes, quotes, severity |
| Are issues **PDS-specific**, **app-integration**, or **content/demo**? | Tagged findings (see §10) |

### Out of scope

- Legal WCAG conformance sign-off for a live Porsche shop
- Performance, visual design critique, or copywriting quality (except where copy blocks understanding)
- Backend, payment, account, or real order flows (they do not exist)

---

## 2. Type of application

| Aspect | Detail |
|--------|--------|
| **Stack** | Next.js App Router, static export, React 19, PDS v4 (`@porsche-design-system/components-react`) |
| **Pattern** | Demo e-commerce: home → catalog → product detail → inquiry |
| **Locales** | `en` (default), `de` — URLs are `/en/…` and `/de/…` |
| **Persistence** | Favorites stored in **session storage** only (lost when the tab closes) |
| **Hosting** | Local dev (`http://localhost:3010`) or static preview after build |

### Route map (test all major views)

| Route | Role |
|-------|------|
| `/[locale]/` | Home — transparent header, hero, lifestyle tiles, carousel, feature tiles |
| `/[locale]/products/` | Product catalog — filters, sort, favorites filter, product grid |
| `/[locale]/products/[productSlug]/` | Product detail — pricing, sizes (apparel), inquiry flyout, related products |
| `/[locale]/company/[companySlug]/` | Footer placeholder (5 slugs) |
| `/[locale]/legal/[legalSlug]/` | Footer placeholder (5 slugs) |

**Suggested deep-test products (English):**

- **Non-apparel:** `/en/products/porsche-design-baseball-cap/` (tags, favorites, inquiry)
- **Apparel (sizes + size chart):** `/en/products/womens-t-shirt-essential/`
- **Reduced price (sale copy on tile):** any product with a strikethrough price in the catalog

---

## 3. Important: this is not a real application

Please set this expectation with participants **before** the session:

1. **Content is fictional or placeholder** — product names, prices, legal text, and company pages are for layout and component coverage only.
2. **Functionality is reduced** — newsletter subscribe, contact form, and social links do not perform real actions; footer company/legal pages show a short “dummy” notice.
3. **Forms do not submit to a server** — the product inquiry flyout validates locally, shows a loading state, then a success message. No email is sent and no data is stored server-side.
4. **Search is client-side** over a static JSON catalog — results are demo data, not live inventory.
5. **Favorites are session-only** — refreshing may clear state depending on browser settings; this is intentional for testing.
6. **Do not report “missing checkout” or “wrong legal text”** as accessibility defects unless they hide information from assistive technology.

Participants should treat the site as a **component showcase with realistic navigation**, not a shop they would trust for purchase.

---

## 4. Participants, assistive technology, and facilitation

### Who to include

Aim for a **mix of disabilities and tools**, for example:

- Blind or low-vision users: **NVDA** (Windows), **JAWS** (Windows), **VoiceOver** (macOS/iOS)
- Motor impairments: **keyboard only**, switch access, or voice control (Dragon, etc.)
- Low vision: **zoom** (200–400%), high contrast mode, Windows Magnifier
- Deaf or hard of hearing: less critical here (no essential audio), but captions matter if video is added later

### Facilitator guidelines

- Use **task-based scenarios** (§8), not a long checklist read aloud.
- Let participants use **their own familiar AT settings**; avoid switching screen readers mid-session unless comparing tools is the goal.
- Allow **exploration** after each task — many issues surface when users wander.
- Do **not** lead with “click the button in the top right” — use role/name references only if the participant is stuck after several minutes.
- Record **browser + AT version** (e.g. Chrome 134 + NVDA 2024.4).
- Plan **60–90 minutes** per participant; use two sessions if fatigue appears.

### Recommended environment

From the repository root:

```bash
npm run dev:pds-ui-testing
```

Open `http://localhost:3010/en/` (or `/de/` for German). For a production-like static build:

```bash
npm run build:pds-ui-testing
npm run preview:pds-ui-testing
```

Use a **private window** or clear session storage between participants if testing favorites from a clean state.

---

## 5. Global chrome (present on almost every page)

These elements repeat across routes. Test them on **home** (transparent header) and **products** (opaque header).

### 5.1 Skip link

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Load any localized page | First Tab stop should be “Skip to main heading” (or German equivalent) |
| 2 | Activate skip link | Focus moves to the page **h1** (`#page-heading`); main content is reachable without tabbing through the whole header |

**PDS / app:** `PLinkPure` + programmatic focus (`skip-to-page-heading.ts`).

### 5.2 Main navigation (shop menu)

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Find the menu control (hamburger / “Menu”) | Name, expanded/collapsed state announced |
| 2 | Open menu | `PDrilldown` opens; label reflects shop categories |
| 3 | Drill into “Clothing” (or localized label) | Sub-links (Women, Men, Kids, View all) are reachable and activate |
| 4 | Choose a sub-link | Menu closes; catalog loads with filters applied |
| 5 | Re-open menu and dismiss with Escape or close control | Focus returns sensibly; no trap |

**PDS:** `PButtonPure`, `PDrilldown`, `PDrilldownItem`, `PDrilldownLink`.

### 5.3 Brand / home link

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Find crest (small viewports) or wordmark | Link name identifies home; activation goes to `/[locale]/` |

**PDS:** `PCrest`, `PWordmark`.

### 5.4 Favorites (header)

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | With no favorites saved, inspect the heart link | Accessible name describes empty favorites |
| 2 | Add a favorite from a product tile (later tasks), return to header | **Live region** announces count change; visible badge is decorative (`aria-hidden`) |
| 3 | Activate favorites link | Navigates to catalog with “favorites only” filter |

**PDS:** `PLinkPure`; app adds `aria-live` polite region.

### 5.5 Product search (header)

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Open search | Modal opens; labelled dialog (`PModal`) |
| 2 | Type fewer than minimum characters (see hint text) | Prompt / empty state is announced |
| 3 | Type a product name (e.g. “cap” or “T-Shirt”) | Results list updates; each result is a link with name and price |
| 4 | Select a result | Modal closes; product detail page loads |
| 5 | Dismiss modal without choosing | Focus returns to search trigger |

**PDS:** `PButtonPure`, `PModal`, `PInputSearch`, `PLinkPure`, `PButton`.

### 5.6 Footer (all pages)

Work through each block **once** on any page (e.g. home).

| Area | Components | What to observe |
|------|------------|-----------------|
| Region / language | `PHeading`, `PFlag`, `PText`, language link | Headings structure; language switch announces target language |
| Newsletter | `PHeading`, `PText`, `PButton` | Button is present; no real signup — note if users expect confirmation |
| Contact | `PButton` | Same as above |
| Social | `PLink` list with `aria-label` per network | Icon-only links have accessible names; `target="_blank"` |
| Company links | `nav` + `PLinkPure` | Five links; each opens placeholder page with h1 + notice |
| Legal row | `PLinkPure`, disclaimer text | Links to legal placeholders |

**PDS:** `PHeading`, `PFlag`, `PText`, `PButton`, `PLink`, `PLinkPure`, `PDivider`, `PWordmark`.

### 5.7 Favorites toast (global)

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Toggle favorite on a product tile | Toast appears; success/warning message is announced (not only visual) |
| 2 | Toggle off | Second toast; no duplicate focus steal |

**PDS:** `PToast`, toast manager.

---

## 6. Home page — `/[locale]/`

**Header variant:** transparent overlay on hero (`scheme-dark`).

### 6.1 Hero

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Land on home after skip link | **h1** hero heading; teaser image has meaningful `alt` |
| 2 | Activate primary CTA | Modal opens (`aria-haspopup="dialog"`) |
| 3 | Read modal content | Numbered list (`PTextList`), headings, body text |
| 4 | Follow link to products or dismiss modal | Focus management on close; no background scroll trap issues |

**PDS:** `PHeading`, `PButton`, `PModal`, `PTextList`, `PTextListItem`, `PLink`, `PText`.

### 6.2 Intro and lifestyle tiles

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Move to intro section | Section has accessible name (visually hidden **h2** + tag + intro text) |
| 2 | Activate “Shop the look” (or localized) | Navigates to filtered catalog |
| 3 | Explore three lifestyle `PLinkTile`s | Label, description, and link purpose clear; header slot tags if present |
| 4 | Activate a tile | Filtered products page loads |

**PDS:** `PTag`, `PText`, `PLink`, `PLinkTile`.

### 6.3 Trending products carousel

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Find trending section (**h2**) | Region identifiable |
| 2 | Move through carousel | Previous/next controls work; labels from `intl` strings |
| 3 | Inspect a product tile | `PLinkTileProduct`: name, price, like button, link to detail |
| 4 | Toggle “like” on a tile | Favorite state; toast (§5.7) |
| 5 | Open product via tile link | Detail page loads |

**PDS:** `PCarousel`, `PLinkTileProduct`, `PLinkPure` (view all).

### 6.4 Feature tiles

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Find feature section (**h2**) | Two large tiles; labels and descriptions |
| 2 | Activate each tile | Correct filtered catalog URLs |

**PDS:** `PLinkTile`, `PHeading`.

---

## 7. Product catalog — `/[locale]/products/`

**Header variant:** opaque default header.

### 7.1 Page header

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Skip to main | **h1** “Products” (localized); subtitle present |

**PDS:** `PHeading`, `PText`.

### 7.2 Quick filters (tabs)

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Find tab bar | All / Women apparel / Men apparel / Kids apparel / Porsche Design |
| 2 | Select each tab | Active tab indicated; product count updates (`aria-live` on count) |
| 3 | Confirm URL/query updates | Shareable state; back button behavior (optional) |

**PDS:** `PTabsBar`.

### 7.3 Sort and filter entry

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Open sort `PSelect` | Label; options: recommended, price ↑↓, name |
| 2 | Change sort | List order changes; selection announced |
| 3 | Open filter flyout | Dialog/flyout labelled; `aria-haspopup` on filter button |

**PDS:** `PSelect`, `PSelectOption`, `PButton`, `PFlyout`.

### 7.4 Filter flyout (deep)

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Expand accordions: Audience, Category, Collection, Flag, Tag | `PAccordion` summaries readable; open/close state |
| 2 | Check/uncheck several `PCheckbox` filters | State persists; apply via footer primary button |
| 3 | Dismiss flyout | Product grid updates; count label updated |
| 4 | With filters active, find dismissible chips | `PTagDismissible` — each removable; “Clear all” available |
| 5 | Apply “favorites only” via header heart | Chip for favorites; empty state if none saved |

**PDS:** `PAccordion`, `PCheckbox`, `PTagDismissible`, `PButton`, `PIcon`, `PHeading`.

### 7.5 Product grid

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Enter product region | `aria-label` on section; each `article` named by product |
| 2 | Browse tiles | Name, price, VAT note; sale products include strikethrough in link text |
| 3 | Open `PPopover` on a tile (info) | Additional description available to keyboard and AT |
| 4 | Toggle favorite on tile | State on tile; toast |
| 5 | Open product detail | Via tile link |

**PDS:** `PLinkTileProduct`, `PTag`, `PPopover`.

### 7.6 Empty states

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Filter until no products OR open favorites with none saved | `PInlineNotification` with heading + description; `role="status"` region |

**PDS:** `PInlineNotification`.

---

## 8. Product detail — `/[locale]/products/[productSlug]/`

Run **§8.1–8.5** on a non-apparel product, then **§8.6–8.7** on an apparel product.

### 8.1 Wayfinding and overview

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Skip to main | **h1** product name |
| 2 | Use “Back to products” link | Returns to catalog |
| 3 | Hear tags (new release, categories, collections) | `PTag` list not overwhelming; still understandable |

**PDS:** `PLinkPure`, `PHeading`, `PText`, `PTag`.

### 8.2 Image and price

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Product image | `alt` describes product |
| 2 | Price block | Current price, optional original price, VAT note — logical reading order |

**App:** `ProductDetailPrice`; native `img`.

### 8.3 Favorites on detail

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Toggle favorite button | Add/remove labels; state change |

**PDS:** `PButton` or similar favorite control.

### 8.4 Related products

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Scroll to related section | **h2**; grid reuses catalog tile pattern |
| 2 | Open a related product | Navigation works |

**PDS:** `CatalogProductGrid` / `PLinkTileProduct`.

### 8.5 Product inquiry flyout (critical — many PDS form components)

Open via inquiry / cart button on detail page.

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Open flyout | Labelled dialog; product thumbnail + name in header |
| 2 | **Step 1 — Request type** | `PRadioGroup` (required) — quote / availability / support; `PSegmentedControl` priority |
| 3 | Try **Next** without required fields | Error summary `PInlineNotification`; focus moves to first invalid field |
| 4 | Complete step 1, go to **Step 2 — Contact** | `PInputText` (first/last), `PInputEmail`, optional `PInputTel`; stepper updates |
| 5 | Use stepper to jump steps | `PStepperHorizontal` — current step announced; focus moves into new panel |
| 6 | **Step 3 — Location** | `PSelect` with `POptgroup`, `PMultiSelect`, `PTextarea` (counter/max length), `PSwitch`, `PCheckbox` + `PPopover` on privacy |
| 7 | **Step 4 — Scheduling** | `PInputDate`, `PInputTime`, `PInputMonth`, `PInputWeek`, `PPinCode`, `PInputPassword` (demo fields) |
| 8 | Submit valid form | `PSpinner` + polite status; then success `PInlineNotification` |
| 9 | Close flyout | Focus return; form resets on reopen |

**PDS:** `PFlyout`, `PStepperHorizontal`, `PStepperHorizontalItem`, `PFieldset`, `PRadioGroup`, `PRadioGroupOption`, `PSegmentedControl`, `PSegmentedControlItem`, all inputs listed above, `PInlineNotification`, `PSpinner`, `PButton`.

### 8.6 Apparel only — size selector

On `/en/products/womens-t-shirt-essential/` (or similar):

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | Find “Sizes” **h2** | `PSegmentedControl` for sizes; selection state |
| 2 | Open size comparison | Sheet opens (`PSheet`) |
| 3 | Use sortable table | `PTable` headers sort; data readable cell-by-cell |
| 4 | Close sheet | Focus restoration |

**PDS:** `PSegmentedControl`, `PSheet`, `PTable`, `PTableHead`, `PTableBody`, `PButton`, `PButtonPure`.

---

## 9. Placeholder pages (footer targets)

Quick pass — one company and one legal page is enough unless time allows all ten.

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | From footer, open e.g. `/en/company/glance/` | **h1** title; short notice that page is a placeholder |
| 2 | Open e.g. `/en/legal/notice/` | Same pattern |
| 3 | Confirm header/footer still usable | Skip link, nav, language switch |

**App:** `FooterDummyPage` — `PHeading`, `PText`.

---

## 10. Language switch (optional second pass)

| Step | Action | What to observe |
|------|--------|-----------------|
| 1 | On `/en/`, use footer language control | Switches to `/de/`; `lang` on document; UI strings German |
| 2 | Repeat **one** short task (e.g. open search, find a product) | Component labels localized; reading order unchanged |

---

## 11. Keyboard and zoom checklist (apply across tasks)

Use alongside the scenarios above:

- [ ] All interactive controls reachable in logical Tab order
- [ ] Visible focus indicator on links, buttons, form fields, tabs, carousel controls
- [ ] Escape closes modals, flyouts, drilldown, sheets (where applicable)
- [ ] No keyboard trap (except intentional modal focus loop while open)
- [ ] Browser zoom 200% and 400%: no horizontal scroll on main content; controls remain usable
- [ ] Windows high contrast / forced colors: controls still visible (note PDS gaps)

---

## 12. Documenting findings

Use a consistent template per issue:

| Field | Content |
|-------|---------|
| **ID** | e.g. A11Y-001 |
| **Severity** | Blocker / Major / Minor / Suggestion |
| **Category** | PDS component / App integration / Demo content / AT-specific |
| **Page / route** | e.g. `/en/products/` |
| **Component** | e.g. `PFlyout`, `PStepperHorizontal` |
| **AT + browser** | e.g. NVDA 2024.4 + Firefox 135 |
| **Steps** | Minimal reproduction |
| **Expected** | What the user needed |
| **Actual** | What happened (quote the screen reader if useful) |
| **Recommendation** | Fix direction (without prescribing code unless obvious) |

Tag whether the issue reproduces in **isolated PDS docs** — that helps the design system team prioritize.

---

## 13. Relationship to automated tests

CI runs Playwright + **axe** on all `page.tsx` routes (zero violations rule). That does **not** replace this plan:

| Automated (axe) | This plan (users + AT) |
|-----------------|-------------------------|
| Rule-based DOM checks | Real speech output and mental models |
| Single page snapshot | Multi-step flows and fatigue |
| No preference for SR brand | NVDA vs JAWS vs VoiceOver differences |

Run automated tests before sessions to avoid known technical failures:

```bash
npm run test:a11y:pds-ui-testing
```

---

## 14. Suggested session agenda (90 minutes)

| Time | Activity |
|------|----------|
| 0–10 min | Intro, consent, demo-app disclaimer (§3), AT setup |
| 10–25 min | Home + global chrome (§5–6) |
| 25–50 min | Catalog: filter, sort, favorites, open product (§7) |
| 50–75 min | Product detail + inquiry flyout + apparel sizes (§8) |
| 75–85 min | Footer placeholders + language (§9–10) if time |
| 85–90 min | Debrief: hardest tasks, PDS vs app, quotes |

Adjust pace for participant preference; **inquiry flyout (§8.5)** is the highest-value PDS coverage.

---

## 15. Reference — PDS components exercised in this app

| Area | Components |
|------|------------|
| Header | `PCrest`, `PWordmark`, `PButtonPure`, `PDrilldown*`, `PLinkPure`, `PModal`, `PInputSearch` |
| Home | `PHeading`, `PButton`, `PModal`, `PTextList`, `PLink`, `PLinkTile`, `PCarousel`, `PLinkTileProduct` |
| Catalog | `PTabsBar`, `PSelect`, `PFlyout`, `PAccordion`, `PCheckbox`, `PTagDismissible`, `PInlineNotification`, `PLinkTileProduct`, `PPopover`, `PTag` |
| Detail | `PLinkPure`, `PTag`, inquiry flyout form set (§8.5), `PSegmentedControl`, `PSheet`, `PTable*` |
| Footer | `PHeading`, `PFlag`, `PText`, `PButton`, `PLink`, `PLinkPure`, `PDivider`, `PWordmark` |
| Global | `PToast`, favorites live region |

For component API details, use the [Porsche Design System documentation](https://designsystem.porsche.com/).

---

*Document version: 1.0 — aligned with `pds-ui-testing` App Router structure and PDS v4.1.*
