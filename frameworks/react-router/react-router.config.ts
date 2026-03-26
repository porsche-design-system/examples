import type { Config } from '@react-router/dev/config';

// This configuration is only needed for a static build (SSG) to deploy this demo to GitHub Pages.
export default {
  basename: '/examples/v4/react-router',
  ssr: false,
  prerender: true,
} satisfies Config;
