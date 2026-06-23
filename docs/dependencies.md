# Dependencies

> **AI agents**: For the recurring update task, follow the deterministic runbook in
> [`docs/runbooks/dependency-updates-agent.md`](runbooks/dependency-updates-agent.md). The sections below provide the
> full rationale.

This is an **npm workspaces monorepo**. The workspaces are declared in the root [`package.json`](../package.json):
`frameworks/*` (angular, astro, next-js, react, react-router, vanilla-js, vue), `patterns` and `templates`. Each
workspace is named `@porsche-design-system/<name>` and keeps its own `package.json`. Dependencies are **hoisted** to the
repo-root `node_modules` by npm.

## Dependency updates

We update our npm packages regularly. Updates are driven by [`syncpack`](#syncpack-helper-scripts) via the root scripts —
do **not** edit versions in each `package.json` by hand, as syncpack keeps the version ranges consistent across all
workspaces.

> **Automation & cadence**: The npm update task runs **weekly** (Mondays 06:00 UTC), dispatched to the Copilot coding
> agent by [`.github/workflows/weekly-dependency-agent.yml`](../.github/workflows/weekly-dependency-agent.yml), which
> follows the [agent runbook](runbooks/dependency-updates-agent.md). It can also be triggered manually. Dependabot
> ([`.github/dependabot.yml`](../.github/dependabot.yml)) is scoped to **GitHub Actions** updates only and does not manage
> npm dependencies, to avoid competing update PRs.

1. Switch to the **project root directory** and make sure you pulled the latest version.
2. Run `npm run npm:outdated` to see which dependencies have newer versions available (held-back deps are excluded
   automatically, see [Held-back dependencies](#held-back-dependencies)).
3. Run `npm run npm:update` to interactively pick and apply updates. syncpack writes the new ranges into every
   `package.json` across the workspaces in one go. Don't upgrade too many dependencies at once — keep related upgrades
   grouped (e.g. if React types can be upgraded, also check whether React itself can be upgraded; keep the `@angular/*`
   family in lockstep).
4. Run `npm install` to update `package-lock.json`, then execute the automated tests to make sure the examples still
   work.
5. Once everything is updated, delete `package-lock.json` and recreate it by running `npm install` again, so the
   transitive dependencies of our dependencies are refreshed too.

`@playwright/test` is intentionally excluded from this flow and updated manually — see
[Held-back dependencies](#held-back-dependencies). Angular is updated through this normal syncpack flow; running its
framework **migrations** is described in [Updating Angular](#updating-angular).

### Syncpack helper scripts

[`syncpack`](https://syncpack.dev) is pinned as a root `devDependency` (do **not** rely on an unpinned `npx syncpack`,
as its CLI changed across major versions). Its behavior is configured centrally in
[`.syncpackrc.json`](../.syncpackrc.json) (JSON with `$schema` for editor validation, matching our `biome.json`
convention). The following root scripts help keep dependency versions consistent across the workspaces:

| Script                   | Purpose                                                                          |
| ------------------------ | -------------------------------------------------------------------------------- |
| `npm run npm:lint`       | Lint dependency versions for mismatches across workspaces (`syncpack lint`).     |
| `npm run npm:lint:fix`   | Fix mismatched versions so all workspaces use the same version (`syncpack fix`). |
| `npm run npm:list`       | List every dependency and its version usage across workspaces.                   |
| `npm run npm:format`     | Check that each `package.json` is formatted (field order, sorting).              |
| `npm run npm:format:fix` | Apply `package.json` formatting.                                                 |
| `npm run npm:outdated`   | Check the npm registry for newer versions (excludes held-back deps, see below).  |
| `npm run npm:update`     | Interactively pick updates to apply (excludes held-back deps, see below).        |
| `npm run npm:audit`      | Run `npm audit` to review advisories (report only — see below).                  |

The held-back dependencies listed under [Held-back dependencies](#held-back-dependencies) are excluded from the
automated update checks via an `isIgnored` [`updateGroups`](https://syncpack.dev/update-groups/ignored/) entry in
[`.syncpackrc.json`](../.syncpackrc.json). When you add a new held-back dependency, add it to that `updateGroups` entry.

Because all examples are npm `workspaces` members, `syncpack` scans them by default — there is no separate `source` list
to maintain. When you add or remove a workspace, update only the `workspaces` array in the root `package.json`.

## Strict peer dependency resolution

`npm install` runs with **strict** peer dependency resolution (npm 7+ default). We intentionally do **not** use
`--legacy-peer-deps` or `--force`, and these are not enabled in `.npmrc`.

When a third-party package declares a peer dependency range that conflicts with the versions we pin, or when a transitive
dependency has a security advisory, resolve it explicitly via the `overrides` field in the root
[`package.json`](../package.json) instead of disabling peer-dependency checks globally.

The current `overrides` force vulnerable transitive dependencies up to their first patched release using per-major
version-selector keys (e.g. `"brace-expansion@5.x": "5.0.6"`, `"postcss@8.x": "8.5.15"`). After adding or changing an
override, delete `package-lock.json` **and** `node_modules` and re-run `npm install`; a plain `npm install` only
re-resolves changed nodes, so stale transitive entries keep their old (vulnerable) versions and the override appears to
have no effect.

## Auditing dependencies (`npm audit`)

Use `npm run npm:audit` (plain `npm audit`) to review advisories. **Do not run `npm audit fix` /
`npm audit fix --force`** on this monorepo. `npm audit fix` does not understand our workspace setup and will try to
"repair" a transitive advisory by **downgrading a hoisted dev tool**, which then violates our pinned tooling and can
abort with `ERESOLVE` under [strict peer resolution](#strict-peer-dependency-resolution).

> To **report** a security vulnerability (as opposed to routinely auditing dependencies), follow the disclosure process
> in [`SECURITY.md`](../SECURITY.md) — do not open a public issue.

### Remediation policy

- For a **genuinely fixable** advisory, add a pinned [`overrides`](#strict-peer-dependency-resolution) entry in the root
  `package.json` and run `npm install`.
- For an advisory in a **held-back** dependency (Playwright — see [Held-back dependencies](#held-back-dependencies)),
  wait for the upstream-sanctioned upgrade path.
- Never reach for `--legacy-peer-deps` or `--force`.
- After adding/changing overrides, delete `package-lock.json` and `node_modules` and re-run `npm install`
  ([Dependency updates](#dependency-updates) step 5). A plain `npm install` only re-resolves changed nodes, so stale
  transitive entries keep their old (vulnerable) versions and the override appears to have no effect.

## Held-back dependencies

These dependencies are intentionally excluded from the automated `syncpack` / `npm run npm:update` flow via the
`isIgnored` `updateGroups` entry in [`.syncpackrc.json`](../.syncpackrc.json). Keep that entry in sync when adding a new
held-back dependency.

### Why they are held back

- `@playwright/test` — pinned to keep browser binaries and committed VRT snapshots in sync with the Docker image used for
  tests; upgrade deliberately (see [How to update them](#how-to-update-them)).

### How to update them

#### Updating Angular

Angular is a normal npm workspace (`frameworks/angular`) with its own `package.json` and an `ng` script. Because it
consumes the **published** `@porsche-design-system/components-angular` package, plain `ng update` works here — no custom
wrapper script is needed.

- **Version ranges** (`@angular/*`, `@angular/build`, `@angular/cli`, `@angular/compiler-cli`, `zone.js`) are owned by
  `syncpack`. Bump them **first** via `npm run npm:update` (pick the `@angular/*` family together so they move in
  lockstep), then `npm install` from the repo root. Keep `typescript` within Angular's supported `MAX_TS_VERSION`
  ceiling.
- **Framework migrations** (code transforms) are applied afterwards with `ng update --migrate-only`. Because syncpack
  already bumped the versions, use `--migrate-only` so the CLI **only** runs the schematics and does not touch versions
  or hit the registry:

  ```bash
  cd frameworks/angular
  npm run ng -- update                                                  # list available updates/migrations (read-only)
  npm run ng -- update @angular/core @angular/cli --migrate-only --from=<old> --to=<new>
  cd ../..
  git diff frameworks/angular                                           # review migration changes
  npm install                                                           # from repo root, refresh the lockfile
  ```

#### Updating Playwright

`@playwright/test` is held back, so update it deliberately. The version must stay in sync with the **Docker image** used
for tests and the **committed VRT snapshots**:

1. Bump the `@playwright/test` range across the workspaces (e.g. with `npm run npm:lint:fix` after editing one
   `package.json`), then run `npm install`.
2. Update the Playwright Docker image tag (`mcr.microsoft.com/playwright:vX.Y.Z`) in
   [`docker-compose.yml`](../docker-compose.yml) to match. A mismatch between the installed Playwright and the Docker
   image makes the tests fail.
3. Regenerate and verify the committed VRT snapshots in Docker (`./docker.sh npm run test:vrt:patterns`) so browser
   binaries and screenshots stay in sync.
