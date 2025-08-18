# Examples by Porsche Design System

Designed and developed by the [Porsche Design System](https://designsystem.porsche.com/) team, this repository showcases Patterns, Templates and JS framework integration examples.
The projects are built using [WCAG 2.2 (AA)](https://www.w3.org/TR/WCAG22/) compliant [Porsche Design System Components](https://designsystem.porsche.com/v3/components/introduction), aligning with the [Porsche Corporate Identity](https://brand.porsche.com/) and leveraging [Tailwind CSS](https://designsystem.porsche.com/v3/tailwindcss/introduction).

## Demo

### Frameworks

- [Angular](https://porsche-design-system.github.io/examples/angular/)
- [Next.js](https://porsche-design-system.github.io/examples/next-js/)
- [React](https://porsche-design-system.github.io/examples/react/)
- [React Router](https://porsche-design-system.github.io/examples/react-router/)
- [Vanilla JS](https://porsche-design-system.github.io/examples/vanilla-js/)
- [Vue](https://porsche-design-system.github.io/examples/vue/)

### Patterns

- [Header / 1](https://porsche-design-system.github.io/examples/patterns/header/1/)
- [Header / 2](https://porsche-design-system.github.io/examples/patterns/header/2/)
- [Footer](https://porsche-design-system.github.io/examples/patterns/footer/1/)

### Templates

- [Landing Page](https://porsche-design-system.github.io/examples/templates/landing-page/1/)

## Getting started

### Tools

#### Volta

We recommend using [Volta](https://volta.sh) to manage the correct Node.js and npm version.

```bash
# On most Unix systems including macOS, you can install with a single command:
curl https://get.volta.sh | bash
```

#### Node.js and npm

```bash
# Download and install Node.js:
volta install node@22

# Verify the Node.js version:
node -v

# Verify npm version:
npm -v
```

Volta should automatically pick up the correct Node.js version defined in `./package.json`.

#### Docker

Using Docker is optional but recommended for test automation, as it ensures consistent results across different
machines. This is particularly important for visual regression testing.

1. Register your Docker account on [Hub-Docker](https://hub.docker.com)
2. Download Docker app locally on your machine and login
3. Start Docker

---

### Installation

#### node_modules

Install all required npm packages:

```bash
npm install
```

---

### Setup

The following instructions assume that [WebStorm](https://www.jetbrains.com/webstorm) is used as the IDE.
For other IDEs, please consult their respective documentation.

#### Prettier (Formatter)

1. Go to WebStorm `Preferences`
2. In `Preferences` go to `Languages and Frameworks` -> `Javascript` -> `Prettier`
3. Activate `Automatic Prettier configuration`
4. Change `Run for files` to `**/*.{md,mdx}`
5. Click checkbox `Run on save` and apply

**Note:** If you have to exclude code fom being prettified, see
[Prettier configuration](https://prettier.io/docs/en/ignore.html#javascript)

#### Biome (Formatter + Linter)

1. Go to WebStorm `Preferences`
2. Click on the Plugins tab and search for `biome`
3. Install Biome
4. In `Preferences` go to `Languages and Frameworks` -> `Biome`
5. Activate `Automatic Biome configuration`
6. Change `Supported extensions` to
   `.astro,.css,.gql,.graphql,.js,.mjs,.cjs,.jsx,.json,.jsonc,.svelte,.html,.ts,.mts,.cts,.tsx,.vue`
7. Click checkbox `Run format on save`, `Run safe fixes on save`, `Sort import on save` and apply

**Note:** If you have to exclude code fom being formatted or linted, see
[Biome configuration](https://biomejs.dev/linter/#ignore-code)

---

### Commands

All available commands for developing, building and testing are listed in the **scripts** section of the
`./package.json` file in the project root. You can execute them from the project root directory:

#### Development

- `npm run dev:angular`
- `npm run dev:react`
- `npm run dev:next-js`
- `npm run dev:react-router`
- `npm run dev:vanilla-js`
- `npm run dev:vue`
- `npm run dev:patterns`
- `npm run dev:templates`

#### Build

- `npm run build:angular`
- `npm run build:react`
- `npm run build:next-js`
- `npm run build:react-router`
- `npm run build:vanilla-js`
- `npm run build:vue`
- `npm run build:patterns`
- `npm run build:templates`

#### Preview

- `npm run preview:angular`
- `npm run preview:react`
- `npm run preview:next-js`
- `npm run preview:react-router`
- `npm run preview:vanilla-js`
- `npm run preview:vue`
- `npm run preview:patterns`
- `npm run preview:templates`

#### Tests

- `npm run test:e2e:patterns`
- `npm run test:a11y:patterns`
- `npm run test:vrt:patterns`

Any command can also be executed in a Docker container by running it with `./docker.sh`, such as:

- `./docker.sh npm install`
- `./docker.sh npm run dev:patterns`
- `./docker.sh npm run build:patterns`
- `./docker.sh npm run preview:patterns`
- `./docker.sh npm run test:e2e:patterns`
- `./docker.sh npm run test:a11y:patterns`
- `./docker.sh npm run test:vrt:patterns`
- …
