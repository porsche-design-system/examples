# Dependency Updates — AI Agent Runbook

> **Audience**: An AI agent running the **recurring npm dependency update** for this examples monorepo.
>
> This is a deterministic, step-by-step runbook. It restates the relevant parts of
> [`docs/dependencies.md`](../dependencies.md) as an executable workflow. When in doubt about _why_ a rule exists, read
> the linked sections there — but **follow this runbook's steps and order exactly**.

## Goal & scope

- **Goal**: Bump non-held-back npm dependencies to their newest compatible versions, keep the lockfile consistent, and
  open a **single reviewable pull request** with passing builds/tests.
- **Scope**: npm dependencies across the workspaces (`frameworks/*`, `patterns`, `templates`). This task runs **weekly**,
  dispatched to the Copilot coding agent by
  [`.github/workflows/weekly-dependency-agent.yml`](../../.github/workflows/weekly-dependency-agent.yml) (Mondays 06:00
  UTC); it can also be triggered manually. Dependabot is scoped to **GitHub Actions** updates only
  ([`.github/dependabot.yml`](../../.github/dependabot.yml)) and deliberately does **not** touch npm, so there is a single
  source of truth for npm updates.

## Hard rules — never do these

| ❌ Never                                                         | Why                                                                                                |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Run `npm audit fix` / `npm audit fix --force`                    | Breaks the workspace hoisting contract and can abort with `ERESOLVE` (see `docs/dependencies.md`). |
| Use `--legacy-peer-deps` or `--force`                            | We rely on **strict** peer resolution; conflicts must be fixed via `overrides`.                    |
| Edit dependency versions in any `package.json` by hand           | `syncpack` owns version ranges across all workspaces.                                              |
| Edit `package-lock.json` by hand                                 | Regenerate it via `npm install` only.                                                              |
| Upgrade held-back deps by selecting them in `npm run npm:update` | `@playwright/test` stays pinned — update it deliberately (see below).                              |
| Bump `@porsche-design-system/components-*` across a **major**    | Minor/patch PDS updates are routine; a **major** PDS upgrade is a deliberate, human-led adoption.   |
| Push directly to `main`                                          | Always open a PR for human review.                                                                 |

## Held-back dependencies (special handling)

`@playwright/test` is excluded from the `syncpack` flow via the `isIgnored` `updateGroups` entry in
[`.syncpackrc.json`](../../.syncpackrc.json), so `npm run npm:update` already skips it. **Never bump it by selecting it
in `npm run npm:update`.** Update it deliberately via
[Updating Playwright](#updating-playwright-npm-pin--docker-image--vrt) (npm pin + Docker image + VRT).

## Prerequisites

1. Work from the **repository root**.
2. Use **Node v24** and the npm version pinned in the root `package.json` `volta` field (use Volta if available).
3. Ensure a **clean working tree** (`git status` shows no changes) and the latest `main` is pulled.
4. Create a working branch, e.g. `chore/dependency-updates-<YYYY-MM-DD>`.

## Step-by-step workflow

### 1. Install the current baseline

```bash
npm install
```

### 2. Check what is outdated

```bash
npm run npm:outdated
```

This runs `syncpack update --check` and already excludes the held-back `@playwright/test`.

### 3. Apply updates with syncpack

```bash
npm run npm:update
```

- `syncpack` writes consistent ranges into every workspace `package.json` in one go.
- **Group related upgrades** — do not bump everything blindly. If React types are updated, also check React itself; keep
  the `@angular/*` family in lockstep.
- Do not select `@playwright/test`.
- **`@porsche-design-system/components-*`** are bumped routinely to the **latest stable** within the current major. A
  `versionGroups` entry in [`.syncpackrc.json`](../../.syncpackrc.json) keeps every framework variant
  (`-js`, `-react`, `-angular`, `-vue`) on the **same** version, so select them together. Never select a pre-release
  (`-rc`, `-beta`, `-alpha`) and never cross a **major** (e.g. `4.x → 5.x`) — a major PDS upgrade is a deliberate,
  human-led adoption (see [Stop conditions](#stop-conditions-hand-back-to-a-human)).

### 4. Refresh the lockfile and verify the install

```bash
npm install
```

### 5. Apply Angular framework migrations (only if Angular was bumped)

Angular is a normal workspace (`frameworks/angular`) consuming the **published**
`@porsche-design-system/components-angular`, so plain `ng update` works — no wrapper script. Versions are already bumped
by syncpack in step 3, so here you only run the code-transform migrations with `--migrate-only` (this leaves versions to
syncpack and avoids the CLI re-resolving them against the registry).

Only proceed for a **minor/patch** Angular update within the current major (or a major you have explicitly been asked to
do). For a major upgrade, prefer handing off — see [Stop conditions](#stop-conditions-hand-back-to-a-human).

```bash
cd frameworks/angular
npm run ng -- update                                                  # list available updates/migrations (read-only)
npm run ng -- update @angular/core @angular/cli --migrate-only --from=<old> --to=<new>
cd ../..
git diff frameworks/angular                                           # review migration changes
npm install                                                           # refresh the lockfile from the repo root
```

Keep `typescript` within Angular's supported `MAX_TS_VERSION` ceiling; if a syncpack bump would exceed it, keep
`typescript` at its current version this round. If the migrations require non-trivial source changes, **stop** and hand
off rather than forcing it into the dependency PR.

### 6. Resolve peer-dependency conflicts the correct way

If `npm install` fails with `ERESOLVE` due to a third-party peer range conflicting with our pinned versions:

- Add a **pinned `overrides` entry** in the root `package.json` (follow the existing per-major examples like
  `"brace-expansion@5.x": "5.0.6"`).
- Then delete `package-lock.json` **and** `node_modules` and re-run `npm install` (a plain reinstall keeps stale
  transitive entries).
- Never work around it with `--legacy-peer-deps` / `--force`.

### 7. Re-validate the existing `overrides`

Every `overrides` entry in the root [`package.json`](../../package.json) is a workaround for a peer-dependency conflict
or a security advisory (see `docs/dependencies.md` → _Strict peer dependency resolution_). As the tree moves, some become
unnecessary — the transitive dependency may now satisfy our pins natively. Stale overrides silently freeze transitive
versions and hide real upgrades, so prune the ones that are no longer needed.

For each override, **test for staleness** by temporarily removing it, then:

```bash
rm -rf package-lock.json node_modules
npm install
```

If `npm install` succeeds with no `ERESOLVE` **and** `npm run npm:audit` reports no regression for that package, the
override is obsolete — **remove it**. If either fails, restore the entry as-is. Record every removed override in the PR
description and keep `docs/dependencies.md` in sync.

### 8. Keep version ranges consistent

```bash
npm run npm:lint
npm run npm:format
```

If either reports issues, fix them with `npm run npm:lint:fix` / `npm run npm:format:fix`, then re-run the check.

### 9. Regenerate the lockfile cleanly

To refresh transitive dependencies, delete `package-lock.json` and recreate it:

```bash
rm package-lock.json
npm install
```

### 10. Verify builds, lint and tests (do not finalize on failure)

Reproduce the relevant checks **now**, while you can still fix them, and only open the PR once they pass. At minimum:

```bash
npm run lint          # Biome
npm run build         # build all workspaces
```

Then run the **e2e suites relevant to the changed packages** — e.g. a bumped framework dep → that framework's
`npm run test:e2e:<name>`. For broad build-tool bumps (`vite`, `typescript`, `tailwindcss`), prefer a full `npm run
build` plus the e2e suites for the affected workspaces.

**If any check fails:**

1. Diagnose whether the failure is caused by the dependency bump.
2. Fix it within this task when in scope — e.g. adjust an `overrides` entry, pin a compatible version, or adapt source to
   a non-breaking API change.
3. Re-run the checks until they pass.
4. **Do not open (or finalize) the PR while a reproduced check is still failing.** If it cannot be resolved here, follow
   the [Stop conditions](#stop-conditions-hand-back-to-a-human) instead of shipping a red PR.

> Note: VRT runs in Docker against committed snapshots (`./docker.sh npm run test:vrt:patterns`) and may not be fully
> reproducible in every environment. Run what you can; call out the rest in the PR description.

### 11. Review security advisories (report only)

```bash
npm run npm:audit
```

Summarize advisories in the PR. **Do not** run `npm audit fix`. For a genuinely fixable advisory, add a pinned
`overrides` entry (as in step 6) and regenerate the lockfile. Conversely, drop any override an advisory no longer needs
(see [step 7](#7-re-validate-the-existing-overrides)).

## Updating Playwright (npm pin + Docker image + VRT)

`@playwright/test` is held back and **not** part of the routine run (`syncpack` skips it). Update it only deliberately,
because the version is mirrored by the **Docker image** used for tests/VRT and by the **committed VRT snapshots**.
Regenerating snapshots requires Docker, so **only proceed if you can run `./docker.sh`** — otherwise **stop and hand
off** ([Stop conditions](#stop-conditions-hand-back-to-a-human)).

Keep these on the **same** version (npm `X.Y.Z` ↔ image `vX.Y.Z`):

1. The `@playwright/test` range in the workspace `package.json` files (use `npm run npm:lint:fix` to align them), then
   `npm install`.
2. The Docker image reference `mcr.microsoft.com/playwright:vX.Y.Z` in [`docker-compose.yml`](../../docker-compose.yml).
   A mismatch between the installed Playwright and the Docker image makes the tests fail.
3. Regenerate and verify the committed VRT snapshots in Docker:

   ```bash
   ./docker.sh npm run test:vrt:patterns
   ```

Commit the bumped `package.json` files, `package-lock.json`, the Docker image change, and any regenerated VRT snapshots
**together**. If snapshots change beyond what the browser bump explains, **stop** and hand off.

## Output contract

Deliver the result as a **single pull request** the maintainers can review and merge:

- **One PR** containing all dependency changes from this run (no direct pushes to `main`).
- **Target the default branch** (`main`) — closing keywords only auto-close issues when the PR merges into the default
  branch.
- **Close the dispatching issue automatically.** Put a [closing keyword](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)
  in the **PR description** (not just a commit message or a plain `#123` mention), e.g.:

  ```text
  Closes #<issue-number>
  ```

  Use the number of the issue you were assigned. Without this keyword in the PR body, merging the PR will **not** close
  the issue, leaving stale dependency tasks open.
- **PR description** must summarize: which dependencies were bumped (grouped), any `overrides` added or removed, any
  advisories from `npm run npm:audit`, and which builds/tests you ran (and any you could not reproduce, e.g. VRT).

## Stop conditions (hand back to a human)

Stop and request review instead of forcing a change when:

- An `ERESOLVE` conflict cannot be resolved with a clean, scoped `overrides` entry.
- A dependency requires a **major** upgrade with breaking changes affecting source code.
- Builds or tests fail in a way not trivially caused by the version bump.
- An advisory only resolves by touching a held-back dependency.

## Reference

- [`docs/dependencies.md`](../dependencies.md) — full rationale, remediation policy, and held-back-dependency details.
- [`.syncpackrc.json`](../../.syncpackrc.json) — syncpack config and ignored update groups.
- [`docker-compose.yml`](../../docker-compose.yml) — Playwright Docker image (keep in sync with `@playwright/test`).
