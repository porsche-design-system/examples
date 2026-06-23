# Security Policy

Thank you for taking the time to help keep the **Examples of Porsche Design System** secure.

## Reporting a Vulnerability

**Please do not open public GitHub issues for security vulnerabilities.** Public reports give attackers a head start
before we can ship a fix.

Use GitHub's private vulnerability reporting:

➡️ **[Report a vulnerability](https://github.com/porsche-design-system/examples/security/advisories/new)**

This creates a confidential security advisory visible only to you and the maintainers. We will use the same channel to
coordinate a fix, an embargoed disclosure, and (where applicable) a CVE.

When reporting, please include — to the extent possible:

- A clear description of the issue and its impact
- Affected package(s) and version(s)
- Reproduction steps, proof-of-concept, or a minimal failing example
- Any known mitigations or workarounds
- Whether the issue is already public or has been disclosed elsewhere

You can report in **English or German**.

## What to Expect

| Stage                         | Target time                                                              |
| ----------------------------- | ------------------------------------------------------------------------ |
| Acknowledgement of report     | within 5 business days                                                   |
| Initial assessment & triage   | within 10 business days                                                  |
| Fix for critical severity     | within 30 days                                                           |
| Fix for high severity         | within 60 days                                                           |
| Coordinated public disclosure | after a fix is released and consumers have had reasonable time to update |

We will keep you informed throughout the process and credit you in the published advisory unless you prefer to remain
anonymous.

## Scope

### In scope

- Source code in this repository (`frameworks/**`, `patterns/**`, `templates/**`)
- Build & release pipelines (`.github/workflows/**`, `.github/actions/**`)
- The official demos at:
  - [Angular](https://porsche-design-system.github.io/examples/v4/angular/)
  - [Astro](https://porsche-design-system.github.io/examples/v4/astro/)
  - [Next.js](https://porsche-design-system.github.io/examples/v4/next-js/)
  - [React](https://porsche-design-system.github.io/examples/v4/react/)
  - [React Router](https://porsche-design-system.github.io/examples/v4/react-router/)
  - [Vanilla JS](https://porsche-design-system.github.io/examples/v4/vanilla-js/)
  - [Vue](https://porsche-design-system.github.io/examples/v4/vue/)
  - [Patterns](https://porsche-design-system.github.io/examples/v4/patterns/)
  - [Templates](https://porsche-design-system.github.io/examples/v4/templates/)

### Out of scope

The following are **not** in scope for this security policy. If you find an issue that affects them, please contact the
operator directly.

- Unofficial forks, mirrors, or repackaged distributions
- Demo applications, sandboxes, or examples hosted by third parties (CodeSandbox, StackBlitz, etc.) using snapshots of
  our code
- Issues in upstream dependencies — please report those to the respective upstream project. We will, however, ship
  coordinated updates if a critical upstream advisory affects our published packages.
- Best-practice findings without a concrete attack scenario (e.g. "missing security header on the storefront" without a
  demonstrated impact)
- Social engineering, physical attacks, or attacks against Porsche AG infrastructure unrelated to this repository

## Safe Harbor

We support good-faith security research. We will not pursue legal action against researchers who:

- Make a good-faith effort to avoid privacy violations, data destruction, and service disruption
- Only interact with accounts they own or have explicit permission to access
- Report vulnerabilities promptly and through the channel above
- Do not exploit the issue beyond what is necessary to demonstrate it
- Give us a reasonable amount of time to respond before any public disclosure

**Last updated:** 2026-06-23
