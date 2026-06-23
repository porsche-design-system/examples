import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { Features } from 'lightningcss';
import { type Plugin, defineConfig } from 'vite';

// With Vite's Environment API a single build orchestrates multiple environments (`client` + `ssr`) in one pass, so the
// legacy `isSsrBuild` config flag is no longer a reliable per-output signal — it would resolve `process.browser` to the
// same value for every environment, dropping the declarative shadow DOM from the SSR output. Instead we set
// `process.browser` per environment via the `configEnvironment` hook, keyed off the environment name, so the SSR build
// keeps it falsy (emitting `<template shadowrootmode="open">`) while the client build gets it truthy.
const patchProcessBrowserGlobalIdentifierPlugin = (): Plugin => ({
  name: 'pds:patch-process-browser-global-identifier',
  configEnvironment(name) {
    return {
      define: {
        'process.browser': JSON.stringify(name === 'client'),
      },
    };
  },
});

// Ensure base path ends with '/' since the React Router Vite plugin reads
// the raw `base` value before Vite normalizes it (which would add a trailing slash).
// Without it, asset URLs like `/base-pathassets/chunk.js` would be generated instead of `/base-path/assets/chunk.js`.
const basePath = process.env.REACT_ROUTER_PUBLIC_BASE_PATH || '';
const normalizedBase = basePath && !basePath.endsWith('/') ? `${basePath}/` : basePath;

export default defineConfig({
  base: normalizedBase,
  // React Router prerenders by starting a Vite preview server and issuing HTTP requests to it. In CI containers the
  // default `localhost` host can bind to IPv6 (`::1`) while the prerender request connects to IPv4 (`127.0.0.1`)
  // (or vice versa), causing `ECONNREFUSED`. Pin the preview host to IPv4 loopback so the bind address and the
  // request target always match. (Local dev/preview use `react-router dev` / `react-router-serve`, not this server.)
  preview: {
    host: '127.0.0.1',
  },
  css: {
    transformer: 'lightningcss',
    // Disables light-dark() polyfill of lightningcss which is broken https://github.com/porsche-design-system/porsche-design-system/issues/4257
    lightningcss: {
      exclude: Features.LightDark,
    },
  },
  // Native tsconfig paths resolution (replaces the deprecated vite-tsconfig-paths plugin in Vite 8).
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tailwindcss(), reactRouter(), patchProcessBrowserGlobalIdentifierPlugin()],
});
