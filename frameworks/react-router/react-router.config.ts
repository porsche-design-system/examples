import type { Config } from '@react-router/dev/config';

// This configuration is only needed for a static build (SSG) to deploy this demo to GitHub Pages.
// Note: `basename` handles client-side route matching and prerender output paths.
// Vite `base` (set in vite.config.ts) handles asset URL prefixing in HTML — both are needed for subpath deployments.
const basePath = process.env.REACT_ROUTER_PUBLIC_BASE_PATH || '';
const normalizedBase = basePath && !basePath.endsWith('/') ? `${basePath}/` : basePath;

export default {
  basename: normalizedBase,
  ssr: false,
  prerender: true,
} satisfies Config;
